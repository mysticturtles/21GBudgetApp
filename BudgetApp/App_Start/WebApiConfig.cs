using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;



namespace BudgetApp
{
    public class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API Configuration and Services

            //Web API routs
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional}
            );


        }
    }
}
