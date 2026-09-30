<<<NODE 0:1>>>
Error: You currently have nothing selected. You need to select a layer first before using this tool.
<<<END NODE>>>

<<<NODE 2:42>>>
<section id="2:42" name="Button" x="0" y="0" width="849" height="336">
  <frame id="2:41" name="Button" x="80" y="80" width="689" height="176">
    <symbol id="2:21" name="Variant=Primary, State=Default" x="32" y="32" width="93" height="40" />
    <symbol id="2:23" name="Variant=Primary, State=Hover" x="165" y="32" width="93" height="40" />
    <symbol id="2:25" name="Variant=Primary, State=Pressed" x="298" y="32" width="93" height="40" />
    <symbol id="2:27" name="Variant=Primary, State=Focus" x="431" y="32" width="93" height="40" />
    <symbol id="2:29" name="Variant=Primary, State=Disabled" x="564" y="32" width="93" height="40" />
    <symbol id="2:31" name="Variant=Secondary, State=Default" x="32" y="104" width="93" height="40" />
    <symbol id="2:33" name="Variant=Secondary, State=Hover" x="165" y="104" width="93" height="40" />
    <symbol id="2:35" name="Variant=Secondary, State=Pressed" x="298" y="104" width="93" height="40" />
    <symbol id="2:37" name="Variant=Secondary, State=Focus" x="431" y="104" width="93" height="40" />
    <symbol id="2:39" name="Variant=Secondary, State=Disabled" x="564" y="104" width="93" height="40" />
  </frame>
</section>
IMPORTANT: The user has selected a section node, so you have received a sparse metadata response. You MUST call get_design_context on the nodes or their sublayers individually based on their IDs to implement the design.
<<<END NODE>>>

<<<NODE 2:68>>>
<section id="2:68" name="Plan card" x="0" y="440" width="1080" height="673">
  <symbol id="2:43" name="Plan card" x="80" y="120" width="360" height="433" />
  <frame id="2:69" name="Plan card / Dark mode" x="560" y="80" width="440" height="513">
    <instance id="2:70" name="Plan card" x="40" y="40" width="360" height="433" />
  </frame>
</section>
IMPORTANT: The user has selected a section node, so you have received a sparse metadata response. You MUST call get_design_context on the nodes or their sublayers individually based on their IDs to implement the design.
<<<END NODE>>>

<<<NODE 2:21>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Default";
  variant?: "Primary";
};

function Button({ className, label = "Continue", state = "Default", variant = "Primary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/brand\\/default,#3452e1)] content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)]"} data-node-id="2:21">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,white)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:22">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:21: the PNG is saved at ../.figma-mcp/49de3a3d69fe.png (97x44).]
<<<END NODE>>>

<<<NODE 2:23>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Hover";
  variant?: "Primary";
};

function Button({ className, label = "Continue", state = "Hover", variant = "Primary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/brand\\/hover,#2b44c0)] content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)] shadow-[0px_2px_6px_0px_rgba(52,82,225,0.28)]"} data-node-id="2:23">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,white)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:24">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:23: the PNG is saved at ../.figma-mcp/afbca19fb858.png (105x52).]
<<<END NODE>>>

<<<NODE 2:25>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Pressed";
  variant?: "Primary";
};

function Button({ className, label = "Continue", state = "Pressed", variant = "Primary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/brand\\/pressed,#22369a)] content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)]"} data-node-id="2:25">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,white)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:26">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:25: the PNG is saved at ../.figma-mcp/77ceef72932a.png (93x40).]
<<<END NODE>>>

<<<NODE 2:27>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Focus";
  variant?: "Primary";
};

function Button({ className, label = "Continue", state = "Focus", variant = "Primary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/brand\\/default,#3452e1)] content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)] shadow-[0px_0px_0px_2px_var(--color\\/surface\\/default,white),0px_0px_0px_4px_var(--color\\/brand\\/ring,#9db0ff)]"} data-node-id="2:27">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,white)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:28">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:27: the PNG is saved at ../.figma-mcp/ddf78c7b62be.png (101x48).]
<<<END NODE>>>

<<<NODE 2:29>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Disabled";
  variant?: "Primary";
};

function Button({ className, label = "Continue", state = "Disabled", variant = "Primary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/disabled\\/bg,#e6e8ef)] content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)]"} data-node-id="2:29">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/disabled\/fg,#9aa1b4)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:30">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:29: the PNG is saved at ../.figma-mcp/f65f209754fb.png (93x40).]
<<<END NODE>>>

<<<NODE 2:31>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Default";
  variant?: "Secondary";
};

function Button({ className, label = "Continue", state = "Default", variant = "Secondary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/surface\\/default,white)] border border-[var(--color\\/border\\/default,#e3e6ed)] border-solid content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)]"} data-node-id="2:31">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:32">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:31: the PNG is saved at ../.figma-mcp/e0eeb788b76c.png (97x44).]
<<<END NODE>>>

<<<NODE 2:33>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Hover";
  variant?: "Secondary";
};

function Button({ className, label = "Continue", state = "Hover", variant = "Secondary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/surface\\/subtle,#f5f6f9)] border border-[var(--color\\/border\\/default,#e3e6ed)] border-solid content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)]"} data-node-id="2:33">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:34">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:33: the PNG is saved at ../.figma-mcp/438943eee07a.png (97x44).]
<<<END NODE>>>

<<<NODE 2:35>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Pressed";
  variant?: "Secondary";
};

function Button({ className, label = "Continue", state = "Pressed", variant = "Secondary" }: ButtonProps) {
  return (
    <div className={className || "bg-[#e9ebf1] border border-[var(--color\\/border\\/default,#e3e6ed)] border-solid content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)]"} data-node-id="2:35">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:36">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:35: the PNG is saved at ../.figma-mcp/4b905dd75689.png (93x40).]
<<<END NODE>>>

<<<NODE 2:37>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Focus";
  variant?: "Secondary";
};

function Button({ className, label = "Continue", state = "Focus", variant = "Secondary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/surface\\/default,white)] border border-[var(--color\\/border\\/default,#e3e6ed)] border-solid content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)] shadow-[0px_0px_0px_2px_var(--color\\/surface\\/default,white),0px_0px_0px_4px_var(--color\\/brand\\/ring,#9db0ff)]"} data-node-id="2:37">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:38">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:37: the PNG is saved at ../.figma-mcp/498c071b9a55.png (101x48).]
<<<END NODE>>>

<<<NODE 2:39>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Disabled";
  variant?: "Secondary";
};

function Button({ className, label = "Continue", state = "Disabled", variant = "Secondary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/disabled\\/bg,#e6e8ef)] border border-[var(--color\\/border\\/default,#e3e6ed)] border-solid content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)]"} data-node-id="2:39">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/disabled\/fg,#9aa1b4)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:40">
        {label}
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:39: the PNG is saved at ../.figma-mcp/de489f241f41.png (93x40).]
<<<END NODE>>>

<<<NODE 2:41>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Default" | "Hover" | "Pressed" | "Focus" | "Disabled";
  variant?: "Primary" | "Secondary";
};

export default function Button({ className, label = "Continue", state = "Default", variant = "Primary" }: ButtonProps) {
  const isPrimaryAndDisabled = variant === "Primary" && state === "Disabled";
  const isPrimaryAndFocus = variant === "Primary" && state === "Focus";
  const isPrimaryAndHover = variant === "Primary" && state === "Hover";
  const isPrimaryAndPressed = variant === "Primary" && state === "Pressed";
  const isSecondaryAndDefault = variant === "Secondary" && state === "Default";
  const isSecondaryAndDisabled = variant === "Secondary" && state === "Disabled";
  const isSecondaryAndFocus = variant === "Secondary" && state === "Focus";
  const isSecondaryAndHover = variant === "Secondary" && state === "Hover";
  const isSecondaryAndPressed = variant === "Secondary" && state === "Pressed";
  return (
    <div className={className || `${String.raw`content-stretch flex gap-[var(--space\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\/md,8px)] `}${isSecondaryAndDisabled ? String.raw`bg-[var(--color\/disabled\/bg,#e6e8ef)] border border-[var(--color\/border\/default,#e3e6ed)] border-solid` : isSecondaryAndFocus ? String.raw`bg-[var(--color\/surface\/default,white)] border border-[var(--color\/border\/default,#e3e6ed)] border-solid shadow-[0px_0px_0px_2px_var(--color\/surface\/default,white),0px_0px_0px_4px_var(--color\/brand\/ring,#9db0ff)]` : isSecondaryAndPressed ? String.raw`bg-[#e9ebf1] border border-[var(--color\/border\/default,#e3e6ed)] border-solid` : isSecondaryAndHover ? String.raw`bg-[var(--color\/surface\/subtle,#f5f6f9)] border border-[var(--color\/border\/default,#e3e6ed)] border-solid shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)]` : isSecondaryAndDefault ? String.raw`bg-[var(--color\/surface\/default,white)] border border-[var(--color\/border\/default,#e3e6ed)] border-solid shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)]` : isPrimaryAndDisabled ? String.raw`bg-[var(--color\/disabled\/bg,#e6e8ef)]` : isPrimaryAndFocus ? String.raw`bg-[var(--color\/brand\/default,#3452e1)] shadow-[0px_0px_0px_2px_var(--color\/surface\/default,white),0px_0px_0px_4px_var(--color\/brand\/ring,#9db0ff)]` : isPrimaryAndPressed ? String.raw`bg-[var(--color\/brand\/pressed,#22369a)]` : isPrimaryAndHover ? String.raw`bg-[var(--color\/brand\/hover,#2b44c0)] shadow-[0px_2px_6px_0px_rgba(52,82,225,0.28)]` : String.raw`bg-[var(--color\/brand\/default,#3452e1)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)]`}`} id={isSecondaryAndDisabled ? "node-2_39" : isSecondaryAndFocus ? "node-2_37" : isSecondaryAndPressed ? "node-2_35" : isSecondaryAndHover ? "node-2_33" : isSecondaryAndDefault ? "node-2_31" : isPrimaryAndDisabled ? "node-2_29" : isPrimaryAndFocus ? "node-2_27" : isPrimaryAndPressed ? "node-2_25" : isPrimaryAndHover ? "node-2_23" : "node-2_21"}>
      {variant === "Primary" && ["Default", "Hover", "Pressed", "Focus"].includes(state) && (
        <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,white)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:22">
          {label}
        </p>
      )}
      {variant === "Secondary" && ["Default", "Hover", "Pressed", "Focus"].includes(state) && (
        <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:32">
          {label}
        </p>
      )}
      {state === "Disabled" && (
        <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/disabled\/fg,#9aa1b4)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:30">
          {label}
        </p>
      )}
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:41: the PNG is saved at ../.figma-mcp/c6c3abe11ad8.png (689x176).]
<<<END NODE>>>

<<<NODE 2:43>>>
type ButtonProps = {
  className?: string;
  label?: string;
  state?: "Default";
  variant?: "Primary";
};

function Button({ className, label = "Continue", state = "Default", variant = "Primary" }: ButtonProps) {
  return (
    <div className={className || "bg-[var(--color\\/brand\\/default,#3452e1)] content-stretch flex gap-[var(--space\\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\\/md,8px)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)]"} data-node-id="2:21">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,white)] tracking-[-0.14px] whitespace-nowrap" data-node-id="2:22">
        {label}
      </p>
    </div>
  );
}

export default function PlanCard({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[var(--color\\/surface\\/default,white)] border border-[var(--color\\/border\\/default,#e3e6ed)] border-solid content-stretch flex flex-col gap-[var(--space\\/5,20px)] items-start overflow-clip p-[var(--space\\/6,24px)] relative rounded-[var(--radius\\/lg,16px)] shadow-[0px_8px_24px_-4px_rgba(17,20,33,0.1),0px_1px_2px_0px_rgba(17,20,33,0.06)] w-[360px]"} data-node-id="2:43" data-name="Plan card">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[var(--space\/2,8px)] items-start not-italic overflow-clip relative shrink-0 w-full" data-node-id="2:44" data-name="Header">
        <p className="font-['Inter:Semi_Bold'] font-semibold leading-[16px] relative shrink-0 text-[12px] text-[color:var(--color\/brand\/default,#3452e1)] tracking-[0.72px] uppercase whitespace-nowrap" data-node-id="2:45">
          Pro
        </p>
        <p className="font-['Inter:Semi_Bold'] font-semibold leading-[28px] relative shrink-0 text-[20px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.4px] whitespace-nowrap" data-node-id="2:46">
          Team workspace
        </p>
        <p className="font-['Inter:Regular'] font-normal leading-[20px] min-w-full overflow-hidden relative shrink-0 text-[14px] text-[color:var(--color\/text\/secondary,#545b6e)] text-ellipsis w-[min-content]" data-node-id="2:47">
          Everything your team needs to plan, track and ship work together, with shared views, guest access, audit logs and priority support from our team.
        </p>
      </div>
      <div className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-node-id="2:48" data-name="Price">
        <p className="font-['Inter:Bold'] font-bold leading-[40px] relative shrink-0 text-[36px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.72px]" data-node-id="2:49">
          $24
        </p>
        <p className="font-['Inter:Regular'] font-normal leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text\/secondary,#545b6e)]" data-node-id="2:50">
          per seat / month
        </p>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#6b6b76] text-[13px] whitespace-nowrap" data-node-id="2:51">
        Billed annually · Cancel anytime
      </p>
      <div className="bg-[var(--color\/border\/default,#e3e6ed)] h-px relative shrink-0 w-full" data-node-id="2:52" data-name="Divider" />
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="2:53" data-name="Features">
        <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="2:54" data-name="Feature">
          <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="2:55" data-name="Bullet">
            <div className="bg-[var(--color\/brand\/default,#3452e1)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="2:56" data-name="Dot" />
          </div>
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] whitespace-nowrap" data-node-id="2:57">
            Unlimited projects
          </p>
        </div>
        <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="2:58" data-name="Feature">
          <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="2:59" data-name="Bullet">
            <div className="bg-[var(--color\/brand\/default,#3452e1)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="2:60" data-name="Dot" />
          </div>
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] whitespace-nowrap" data-node-id="2:61">
            Guest access
          </p>
        </div>
        <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="2:62" data-name="Feature">
          <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="2:63" data-name="Bullet">
            <div className="bg-[var(--color\/brand\/default,#3452e1)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="2:64" data-name="Dot" />
          </div>
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] whitespace-nowrap" data-node-id="2:65">
            Priority support
          </p>
        </div>
      </div>
      <Button className="bg-[var(--color\/brand\/default,#3452e1)] content-stretch flex gap-[var(--space\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\/md,8px)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)] shrink-0 w-full" label="Start free trial" />
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Plan card
**Node ID:** 2:43

Pricing plan summary card.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:43: the PNG is saved at ../.figma-mcp/8aa0a3f3f6df.png (400x473).]
<<<END NODE>>>

<<<NODE 2:69>>>
export default function PlanCardDarkMode() {
  return (
    <div className="bg-[var(--color\/surface\/default,#15171e)] content-stretch flex flex-col items-start p-[40px] relative size-full" data-node-id="2:69" data-name="Plan card / Dark mode">
      <div className="bg-[var(--color\/surface\/default,#15171e)] border border-[var(--color\/border\/default,#2a2e3a)] border-solid content-stretch flex flex-col gap-[var(--space\/5,20px)] items-start overflow-clip p-[var(--space\/6,24px)] relative rounded-[var(--radius\/lg,16px)] shadow-[0px_8px_24px_-4px_rgba(17,20,33,0.1),0px_1px_2px_0px_rgba(17,20,33,0.06)] shrink-0 w-[360px]" data-node-id="2:70" data-name="Plan card">
        <div className="[word-break:break-word] content-stretch flex flex-col gap-[var(--space\/2,8px)] items-start not-italic overflow-clip relative shrink-0 w-full" data-node-id="I2:70;2:44" data-name="Header">
          <p className="font-['Inter:Semi_Bold'] font-semibold leading-[16px] relative shrink-0 text-[12px] text-[color:var(--color\/brand\/default,#6f86ff)] tracking-[0.72px] uppercase whitespace-nowrap" data-node-id="I2:70;2:45">
            Pro
          </p>
          <p className="font-['Inter:Semi_Bold'] font-semibold leading-[28px] relative shrink-0 text-[20px] text-[color:var(--color\/text\/primary,#f2f4f8)] tracking-[-0.4px] whitespace-nowrap" data-node-id="I2:70;2:46">
            Team workspace
          </p>
          <p className="font-['Inter:Regular'] font-normal leading-[20px] min-w-full overflow-hidden relative shrink-0 text-[14px] text-[color:var(--color\/text\/secondary,#a3a9b8)] text-ellipsis w-[min-content]" data-node-id="I2:70;2:47">
            Everything your team needs to plan, track and ship work together, with shared views, guest access, audit logs and priority support from our team.
          </p>
        </div>
        <div className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-node-id="I2:70;2:48" data-name="Price">
          <p className="font-['Inter:Bold'] font-bold leading-[40px] relative shrink-0 text-[36px] text-[color:var(--color\/text\/primary,#f2f4f8)] tracking-[-0.72px]" data-node-id="I2:70;2:49">
            $24
          </p>
          <p className="font-['Inter:Regular'] font-normal leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text\/secondary,#a3a9b8)]" data-node-id="I2:70;2:50">
            per seat / month
          </p>
        </div>
        <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#6b6b76] text-[13px] whitespace-nowrap" data-node-id="I2:70;2:51">
          Billed annually · Cancel anytime
        </p>
        <div className="bg-[var(--color\/border\/default,#2a2e3a)] h-px relative shrink-0 w-full" data-node-id="I2:70;2:52" data-name="Divider" />
        <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I2:70;2:53" data-name="Features">
          <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="I2:70;2:54" data-name="Feature">
            <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="I2:70;2:55" data-name="Bullet">
              <div className="bg-[var(--color\/brand\/default,#6f86ff)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="I2:70;2:56" data-name="Dot" />
            </div>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#f2f4f8)] whitespace-nowrap" data-node-id="I2:70;2:57">
              Unlimited projects
            </p>
          </div>
          <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="I2:70;2:58" data-name="Feature">
            <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="I2:70;2:59" data-name="Bullet">
              <div className="bg-[var(--color\/brand\/default,#6f86ff)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="I2:70;2:60" data-name="Dot" />
            </div>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#f2f4f8)] whitespace-nowrap" data-node-id="I2:70;2:61">
              Guest access
            </p>
          </div>
          <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="I2:70;2:62" data-name="Feature">
            <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="I2:70;2:63" data-name="Bullet">
              <div className="bg-[var(--color\/brand\/default,#6f86ff)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="I2:70;2:64" data-name="Dot" />
            </div>
            <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#f2f4f8)] whitespace-nowrap" data-node-id="I2:70;2:65">
              Priority support
            </p>
          </div>
        </div>
        <div className="bg-[var(--color\/brand\/default,#6f86ff)] content-stretch flex gap-[var(--space\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\/md,8px)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)] shrink-0 w-full" data-node-id="I2:70;2:66" data-name="Button">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,#0b0d14)] tracking-[-0.14px] whitespace-nowrap" data-node-id="I2:70;2:66;2:22">
            Start free trial
          </p>
        </div>
      </div>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Plan card
**Node ID:** 2:43

Pricing plan summary card.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:69: the PNG is saved at ../.figma-mcp/0aa5216ab1b1.png (440x513).]
<<<END NODE>>>

<<<NODE 2:70>>>
export default function PlanCard() {
  return (
    <div className="bg-[var(--color\/surface\/default,white)] border border-[var(--color\/border\/default,#e3e6ed)] border-solid content-stretch flex flex-col gap-[var(--space\/5,20px)] items-start overflow-clip p-[var(--space\/6,24px)] relative rounded-[var(--radius\/lg,16px)] shadow-[0px_8px_24px_-4px_rgba(17,20,33,0.1),0px_1px_2px_0px_rgba(17,20,33,0.06)] size-full" data-node-id="2:70" data-name="Plan card">
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[var(--space\/2,8px)] items-start not-italic overflow-clip relative shrink-0 w-full" data-node-id="I2:70;2:44" data-name="Header">
        <p className="font-['Inter:Semi_Bold'] font-semibold leading-[16px] relative shrink-0 text-[12px] text-[color:var(--color\/brand\/default,#3452e1)] tracking-[0.72px] uppercase whitespace-nowrap" data-node-id="I2:70;2:45">
          Pro
        </p>
        <p className="font-['Inter:Semi_Bold'] font-semibold leading-[28px] relative shrink-0 text-[20px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.4px] whitespace-nowrap" data-node-id="I2:70;2:46">
          Team workspace
        </p>
        <p className="font-['Inter:Regular'] font-normal leading-[20px] min-w-full overflow-hidden relative shrink-0 text-[14px] text-[color:var(--color\/text\/secondary,#545b6e)] text-ellipsis w-[min-content]" data-node-id="I2:70;2:47">
          Everything your team needs to plan, track and ship work together, with shared views, guest access, audit logs and priority support from our team.
        </p>
      </div>
      <div className="[word-break:break-word] content-stretch flex gap-[4px] items-baseline not-italic overflow-clip relative shrink-0 whitespace-nowrap" data-node-id="I2:70;2:48" data-name="Price">
        <p className="font-['Inter:Bold'] font-bold leading-[40px] relative shrink-0 text-[36px] text-[color:var(--color\/text\/primary,#111421)] tracking-[-0.72px]" data-node-id="I2:70;2:49">
          $24
        </p>
        <p className="font-['Inter:Regular'] font-normal leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text\/secondary,#545b6e)]" data-node-id="I2:70;2:50">
          per seat / month
        </p>
      </div>
      <p className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[18px] not-italic relative shrink-0 text-[#6b6b76] text-[13px] whitespace-nowrap" data-node-id="I2:70;2:51">
        Billed annually · Cancel anytime
      </p>
      <div className="bg-[var(--color\/border\/default,#e3e6ed)] h-px relative shrink-0 w-full" data-node-id="I2:70;2:52" data-name="Divider" />
      <div className="content-stretch flex flex-col gap-[12px] items-start overflow-clip relative shrink-0 w-full" data-node-id="I2:70;2:53" data-name="Features">
        <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="I2:70;2:54" data-name="Feature">
          <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="I2:70;2:55" data-name="Bullet">
            <div className="bg-[var(--color\/brand\/default,#3452e1)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="I2:70;2:56" data-name="Dot" />
          </div>
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] whitespace-nowrap" data-node-id="I2:70;2:57">
            Unlimited projects
          </p>
        </div>
        <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="I2:70;2:58" data-name="Feature">
          <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="I2:70;2:59" data-name="Bullet">
            <div className="bg-[var(--color\/brand\/default,#3452e1)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="I2:70;2:60" data-name="Dot" />
          </div>
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] whitespace-nowrap" data-node-id="I2:70;2:61">
            Guest access
          </p>
        </div>
        <div className="content-stretch flex gap-[var(--space\/2,8px)] items-center overflow-clip relative shrink-0" data-node-id="I2:70;2:62" data-name="Feature">
          <div className="bg-[rgba(52,82,225,0.12)] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[16px]" data-node-id="I2:70;2:63" data-name="Bullet">
            <div className="bg-[var(--color\/brand\/default,#3452e1)] relative rounded-[3px] shrink-0 size-[6px]" data-node-id="I2:70;2:64" data-name="Dot" />
          </div>
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)] whitespace-nowrap" data-node-id="I2:70;2:65">
            Priority support
          </p>
        </div>
      </div>
      <div className="bg-[var(--color\/brand\/default,#3452e1)] content-stretch flex gap-[var(--space\/2,8px)] items-center justify-center overflow-clip px-[16px] py-[10px] relative rounded-[var(--radius\/md,8px)] shadow-[0px_1px_2px_0px_rgba(17,20,33,0.08)] shrink-0 w-full" data-node-id="I2:70;2:66" data-name="Button">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--color\/brand\/on,white)] tracking-[-0.14px] whitespace-nowrap" data-node-id="I2:70;2:66;2:22">
          Start free trial
        </p>
      </div>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Plan card
**Node ID:** 2:43

Pricing plan summary card.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 2:70: the PNG is saved at ../.figma-mcp/4c4b88c208a7.png (400x473).]
<<<END NODE>>>

<<<NODE 10:27>>>
export default function MemberRow({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[var(--color\\/surface\\/default,white)] border-[var(--color\\/border\\/default,#e3e6ed)] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative w-[400px]"} data-node-id="10:27" data-name="Member row">
      <div className="bg-[var(--color\/brand\/default,#3452e1)] border border-[rgba(17,20,33,0.12)] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[16px] shrink-0 size-[32px]" data-node-id="10:28" data-name="Avatar">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/brand\/on,white)] whitespace-nowrap" data-node-id="10:29">
          AK
        </p>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="10:30" data-name="Info">
        <p className="font-['Inter:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)]" data-node-id="10:31">
          Alex Kim
        </p>
        <p className="font-['Inter:Regular'] font-normal leading-[normal] relative shrink-0 text-[13px] text-[color:var(--color\/text\/secondary,#545b6e)]" data-node-id="10:32">
          alex.kim@acme.com
        </p>
      </div>
      <div className="bg-[var(--color\/surface\/subtle,#f5f6f9)] content-stretch flex items-start overflow-clip px-[8px] py-[2px] relative rounded-[999px] shrink-0" data-node-id="10:33" data-name="Role">
        <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/text\/secondary,#545b6e)] whitespace-nowrap" data-node-id="10:34">
          Owner
        </p>
      </div>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Member row
**Node ID:** 10:27

One member in a team member list.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 10:27: the PNG is saved at ../.figma-mcp/c1541b2f0dfe.png (400x60).]
<<<END NODE>>>

<<<NODE 10:35>>>
function MemberRow({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[var(--color\\/surface\\/default,white)] border-[var(--color\\/border\\/default,#e3e6ed)] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative w-[400px]"} data-node-id="10:27" data-name="Member row">
      <div className="bg-[var(--color\/brand\/default,#3452e1)] border border-[rgba(17,20,33,0.12)] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[16px] shrink-0 size-[32px]" data-node-id="10:28" data-name="Avatar">
        <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/brand\/on,white)] whitespace-nowrap" data-node-id="10:29">
          AK
        </p>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="10:30" data-name="Info">
        <p className="font-['Inter:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)]" data-node-id="10:31">
          Alex Kim
        </p>
        <p className="font-['Inter:Regular'] font-normal leading-[normal] relative shrink-0 text-[13px] text-[color:var(--color\/text\/secondary,#545b6e)]" data-node-id="10:32">
          alex.kim@acme.com
        </p>
      </div>
      <div className="bg-[var(--color\/surface\/subtle,#f5f6f9)] content-stretch flex items-start overflow-clip px-[8px] py-[2px] relative rounded-[999px] shrink-0" data-node-id="10:33" data-name="Role">
        <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/text\/secondary,#545b6e)] whitespace-nowrap" data-node-id="10:34">
          Owner
        </p>
      </div>
    </div>
  );
}

export default function MemberList({ className }: { className?: string }) {
  return (
    <div className={className || "bg-[var(--color\\/surface\\/default,white)] content-stretch flex flex-col items-start overflow-clip relative rounded-[12px] shadow-[0px_1px_3px_0px_rgba(17,20,33,0.08)] w-[400px]"} data-node-id="10:35" data-name="Member list">
      <MemberRow className="bg-[var(--color\/surface\/default,white)] border-[var(--color\/border\/default,#e3e6ed)] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative shrink-0 w-full" />
      <div className="bg-[var(--color\/surface\/default,white)] border-[var(--color\/border\/default,#e3e6ed)] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="10:44" data-name="Member row">
        <div className="bg-[var(--color\/brand\/default,#3452e1)] border border-[rgba(17,20,33,0.12)] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I10:44;10:28" data-name="Avatar">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/brand\/on,white)] whitespace-nowrap" data-node-id="I10:44;10:29">
            PN
          </p>
        </div>
        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="I10:44;10:30" data-name="Info">
          <p className="font-['Inter:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)]" data-node-id="I10:44;10:31">
            Priya Nair
          </p>
          <p className="font-['Inter:Regular'] font-normal leading-[normal] relative shrink-0 text-[13px] text-[color:var(--color\/text\/secondary,#545b6e)]" data-node-id="I10:44;10:32">
            priya.nair@acme.com
          </p>
        </div>
        <div className="bg-[var(--color\/surface\/subtle,#f5f6f9)] content-stretch flex items-start overflow-clip px-[8px] py-[2px] relative rounded-[999px] shrink-0" data-node-id="I10:44;10:33" data-name="Role">
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/text\/secondary,#545b6e)] whitespace-nowrap" data-node-id="I10:44;10:34">
            Admin
          </p>
        </div>
      </div>
      <div className="bg-[var(--color\/surface\/default,white)] border-[var(--color\/border\/default,#e3e6ed)] border-b border-solid content-stretch flex gap-[12px] items-center px-[16px] py-[12px] relative shrink-0 w-full" data-node-id="10:52" data-name="Member row">
        <div className="bg-[var(--color\/brand\/default,#3452e1)] border border-[rgba(17,20,33,0.12)] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[16px] shrink-0 size-[32px]" data-node-id="I10:52;10:28" data-name="Avatar">
          <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/brand\/on,white)] whitespace-nowrap" data-node-id="I10:52;10:29">
            TB
          </p>
        </div>
        <div className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col items-start min-w-px not-italic overflow-clip relative whitespace-nowrap" data-node-id="I10:52;10:30" data-name="Info">
          <p className="font-['Inter:Medium'] font-medium leading-[20px] relative shrink-0 text-[14px] text-[color:var(--color\/text\/primary,#111421)]" data-node-id="I10:52;10:31">
            Tom Berg
          </p>
          <p className="font-['Inter:Regular'] font-normal leading-[normal] relative shrink-0 text-[13px] text-[color:var(--color\/text\/secondary,#545b6e)]" data-node-id="I10:52;10:32">
            tom.berg@acme.com
          </p>
        </div>
        <div className="bg-[var(--color\/surface\/subtle,#f5f6f9)] content-stretch flex items-start overflow-clip px-[8px] py-[2px] relative rounded-[999px] shrink-0" data-node-id="I10:52;10:33" data-name="Role">
          <p className="[word-break:break-word] font-['Inter:Medium'] font-medium leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/text\/secondary,#545b6e)] whitespace-nowrap" data-node-id="I10:52;10:34">
            Member
          </p>
        </div>
      </div>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Member row
**Node ID:** 10:27

One member in a team member list.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 10:35: the PNG is saved at ../.figma-mcp/f95dd4d3aa37.png (406x186).]
<<<END NODE>>>

<<<NODE 10:28>>>
export default function Avatar() {
  return (
    <div className="bg-[var(--color\/brand\/default,#3452e1)] border border-[rgba(17,20,33,0.12)] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[16px] size-full" data-node-id="10:28" data-name="Avatar">
      <p className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[16px] not-italic relative shrink-0 text-[12px] text-[color:var(--color\/brand\/on,white)] whitespace-nowrap" data-node-id="10:29">
        AK
      </p>
    </div>
  );
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
[Screenshot of node 10:28: the PNG is saved at ../.figma-mcp/498a4b17694a.png (34x34).]
<<<END NODE>>>

<<<NODE 10:60>>>
<section id="10:60" name="Member list" x="0" y="1200" width="1040" height="340">
  <symbol id="10:27" name="Member row" x="80" y="80" width="400" height="60" />
  <symbol id="10:35" name="Member list" x="560" y="80" width="400" height="180" />
</section>
IMPORTANT: The user has selected a section node, so you have received a sparse metadata response. You MUST call get_design_context on the nodes or their sublayers individually based on their IDs to implement the design.
<<<END NODE>>>
