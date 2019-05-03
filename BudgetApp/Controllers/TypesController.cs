using Budget.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace Budget.Controllers
{
    public class TypesController : ApiController
    {
        budgetEntities _db = new budgetEntities();

        [HttpGet]
        public IHttpActionResult GetTypes([FromUri] bool getTypes)
        {
            var types = (from t in _db.types
                         where t.active == 1
                         orderby t.typeName ascending
                         select new TypeData
                         {
                             typeId = t.typeID,
                             typeMod = t.type_mod,
                             typeName = t.typeName
                         }).ToList();

            if (types.FirstOrDefault() != null)
            {
                return Ok(types);
            }
            else
            {
                return StatusCode(HttpStatusCode.NoContent);
            }
        }

        [HttpGet]
        public IHttpActionResult AddType([FromUri] bool addType, [FromUri] string typeMod, [FromUri] string typeName)
        {
            var types = (from t in _db.types
                         where t.typeName == typeName &&
                         t.type_mod == typeMod
                         select new FullType
                         {
                             id = t.typeID,
                             type_mod = t.type_mod,
                             typeName = t.typeName,
                             active = t.active
                         }).ToList();
            if (types.FirstOrDefault() != null)
            {
                if(types.FirstOrDefault().active == 1)
                {
                    return Ok();
                }
                else
                {
                    var typeid = types.FirstOrDefault().id; 
                    _db.types.Where(i => i.typeID == typeid).FirstOrDefault().active = 1;
                    _db.SaveChanges();
                    return StatusCode(HttpStatusCode.Accepted);
                }
            }
            else
            {
                var typeToAdd = new type();
                typeToAdd.active = 1;
                typeToAdd.typeName = typeName;
                typeToAdd.type_mod = typeMod;
                _db.types.Add(typeToAdd);
                _db.SaveChanges();
                var AddedType = (from t in _db.types
                                 where t.type_mod == typeMod &&
                                 t.typeName == typeName
                                 select new FullType {
                                     id = t.typeID
                                 }).ToList();
                if(AddedType.FirstOrDefault() != null)
                {
                    return Created("TypesTable", typeName);
                }
                else
                {
                    return InternalServerError();
                }

            }
        }
    }

    public class FullType
    {
        public int id { get; set; }
        public string type_mod { get; set; }
        public string typeName { get; set; }
        public int active { get; set; }
    }

    public class TypeData
    {
        public int typeId { get; set; }
        public string typeMod { get; set; }
        public string typeName { get; set; }
    }
}