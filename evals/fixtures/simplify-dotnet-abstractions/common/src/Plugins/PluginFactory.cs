using System.Reflection;

namespace SkillEval.Plugins;

public sealed class PluginFactory
{
    public object Create(string assemblyPath, string typeName)
    {
        var assembly = Assembly.LoadFrom(assemblyPath);
        var type = assembly.GetType(typeName, throwOnError: true)!;
        return Activator.CreateInstance(type)!;
    }
}
