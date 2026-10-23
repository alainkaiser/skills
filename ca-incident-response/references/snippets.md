# Snippets the scripts do not cover

## Validate a candidate corrected bundle

```bash
B=/path/to/cacert.pem
shasum -a 256 "$B"
grep -c 'BEGIN CERTIFICATE' "$B"
grep -c '<bad root name>' "$B"; grep -c '<cross-signer name>' "$B"      # both must be 0
for h in <test hosts...>; do CURL_CA_BUNDLE="$B" /usr/bin/curl -sS -o /dev/null --max-time 15 -w "$h %{http_code}\n" "https://$h/"; echo " exit $? (60 = certificate rejected)"; done
for h in github.com api.github.com ghcr.io formulae.brew.sh nodejs.org pypi.org; do CURL_CA_BUNDLE="$B" /usr/bin/curl -sS -o /dev/null --max-time 15 -w "$h %{http_code}\n" "https://$h/"; done
GIT_SSL_CAINFO="$B" git ls-remote https://github.com/Homebrew/brew.git HEAD          # must list a commit
GIT_SSL_CAINFO="$B" git ls-remote https://<test host>/x.git                          # must fail with "SSL certificate problem"
```

Candidates: a certifi `cacert.pem` inside any runtime that already updated (search
`*/certifi/__init__.py` for the fixed version), or Homebrew's
`/opt/homebrew/etc/ca-certificates/cert.pem` after `brew upgrade ca-certificates`.

## Environment for download steps

```bash
export SSL_CERT_FILE="$B" CURL_CA_BUNDLE="$B" GIT_SSL_CAINFO="$B" GIT_SSL_CAPATH="$(dirname "$B")" HOMEBREW_NO_ENV_HINTS=1
unset HOMEBREW_FORCE_BREWED_CA_CERTIFICATES
brew update && scripts/brew-tap-verify.sh && brew upgrade <formulae>
```

## pip, hash-pinned upgrade (per interpreter and per venv)

```bash
<python> -m pip install "pip @ https://files.pythonhosted.org/packages/<path>/pip-<ver>-py3-none-any.whl#sha256=<hash>"
<python> -m pip install --upgrade certifi
```

Take the URL and hash from the advisory. Homebrew Pythons need `PIP_BREAK_SYSTEM_PACKAGES=1`
for the first command when the formula has not shipped the fixed pip yet; the next
`brew upgrade python@3.x` replaces it anyway.

## .NET HttpClient, default and with revocation checking

```bash
mkdir -p /tmp/dntest && cd /tmp/dntest && dotnet new console --force -o . >/dev/null
cat > Program.cs <<'EOF'
using System.Net.Http;
foreach (var host in new[]{"<direct test host>", "<cross-signed test host>", "www.microsoft.com"})
foreach (var crl in new[]{false, true}) {
  try { using var c = new HttpClient(new HttpClientHandler{ CheckCertificateRevocationList = crl }); c.Timeout = TimeSpan.FromSeconds(15);
        var r = await c.SendAsync(new HttpRequestMessage(HttpMethod.Head, "https://" + host + "/"));
        Console.WriteLine($"CRL={crl} {host}: ACCEPTED HTTP {(int)r.StatusCode}"); }
  catch (HttpRequestException e) when (e.InnerException is System.Security.Authentication.AuthenticationException) { Console.WriteLine($"CRL={crl} {host}: CERT-REJECTED: {e.InnerException.Message}"); }
  catch (Exception e) { Console.WriteLine($"CRL={crl} {host}: ERROR: {e.GetBaseException().Message}"); }
}
EOF
dotnet run 2>&1 | grep -E '^CRL'; cd / && rm -rf /tmp/dntest
```

## Inside a container image

```bash
docker run --rm python:3.12-slim sh -c 'python -m pip --version; grep -m1 __version__ /usr/local/lib/python3.12/site-packages/pip/_vendor/certifi/__init__.py; dpkg -s ca-certificates | grep ^Version'
docker run --rm <image> sh -c 'echo | openssl s_client -connect <test host>:443 -servername <test host> 2>/dev/null | grep "Verify return code"'   # 20 = rejected, 0 = accepted
docker run --rm <alpine image> apk info ca-certificates          # 20261020-r0 or later for the 2026 case
docker run --rm <debian/ubuntu image> ls /usr/share/ca-certificates/mozilla/ | grep -iE '<root name fragments>'
docker run --rm node:24-alpine node --version
```

## Remote repository IOC scan with exit codes

```bash
gh api --paginate "user/repos?per_page=100&affiliation=owner,collaborator,organization_member" --jq '.[] | "\(.full_name)\t\(.pushed_at)"' > repos.tsv
while IFS=$'\t' read -r repo pushed; do
  names=$(gh api "repos/$repo/contents/.github/workflows" --jq '.[].name' 2>/dev/null | tr '\n' ' ')
  case " $names " in *" security-audit.yml "*|*" github_actions_security.yml "*) echo "!!! $repo: $names";; esac
  gh api "repos/$repo/contents/.vscode/tasks.json" --silent >/dev/null 2>&1 && echo "$repo has tasks.json (inspect for runOn folderOpen)"
done < repos.tsv
```

`--silent` plus the exit code is the test. Parsing a 404 body with `--jq '.name'` prints
`null`, which a shell test reads as a hit. For GitHub Enterprise hosts set `GH_HOST`.

## Apple's trust engine on a served chain (what verify-tls.sh does per host)

```bash
H=<test host>; mkdir -p /tmp/chain && echo | openssl s_client -connect $H:443 -servername $H -showcerts 2>/dev/null \
  | awk '/BEGIN CERT/{n++; f="/tmp/chain/c"n".pem"} /BEGIN CERT/,/END CERT/{print > f}'
security verify-cert -c /tmp/chain/c1.pem -c /tmp/chain/c2.pem -c /tmp/chain/c3.pem -p ssl -s $H
# CSSMERR_TP_CERT_REVOKED = blocked by revocation; "certificate verification successful" = accepted
nscurl --ats-diagnostics https://$H/ | head -20     # same engine, App Transport Security view
```

## Electron apps: Node side without launching the UI

```bash
app="/Applications/Example.app"; exe="$app/Contents/MacOS/$(/usr/libexec/PlistBuddy -c 'Print CFBundleExecutable' "$app/Contents/Info.plist")"
python3 - "$app/Contents/Frameworks/Electron Framework.framework/Electron Framework" <<'PY'
import sys; d = open(sys.argv[1], "rb").read(); i = d.find(b"dL7pKGdnNz796PbbjQWNKmHXBZaB9tsX") + 32
print("runAsNode fuse:", "on" if d[i + 2:i + 3] == b"1" else "off")
PY
ELECTRON_RUN_AS_NODE=1 "$exe" -e 'require("https").request({host:process.argv[1],method:"HEAD"},r=>console.log("ACCEPTED",r.statusCode)).on("error",e=>console.log(e.code)).end()' <test host>
```

With the fuse off the variable is ignored and the app would open its UI, so check the fuse first.

## cargo through the system libcurl

```bash
CARGO_REGISTRIES_PROBE_INDEX="sparse+https://<test host>/" cargo search --registry probe probe
# "SSL certificate problem" = rejected; "failed to parse"/"expected value" = TLS passed (exposed)
cargo -Vv | grep libcurl        # shows "system" and the SSL backends it rides on
```

## Keychain and Apple trust state

```bash
security find-certificate -a -c "<root name>" /System/Library/Keychains/SystemRootCertificates.keychain | grep '"labl"'
security dump-trust-settings -d 2>&1 | grep -i "<root name>"       # admin overrides
/usr/libexec/PlistBuddy -c "Print" /System/Library/Security/Certificates.bundle/Contents/Resources/AssetVersion.plist
softwareupdate -l
```

## The user's real shell, not the agent's

```bash
zsh -ic 'command -v python3; python3 --version; command -v node; node --version'
```

The agent's shell keeps the PATH it started with; `.zshrc` edits made during the session
show up only this way.
