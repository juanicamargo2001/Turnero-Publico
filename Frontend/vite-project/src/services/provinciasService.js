import axios from "axios";

async function getBarriosCba(pattern){
    try{
        let barrios = await axios.get(`https://gis.cordoba.gob.ar/server/rest/services/Catastro/Catastro_capas_v3/MapServer/52/query?f=json&where=UPPER(nombre)%20LIKE%20%27%25${pattern}%25%27&returnGeometry=false&spatialRel=esriSpatialRelIntersects&outFields=nombre%2Cobjectid&outSR=102100`) 
        //console.log(barrios.data.features)
        return barrios.data;
    }catch(error){
        return error;
    }
}

export const provinciaService = {
    getBarriosCba
}