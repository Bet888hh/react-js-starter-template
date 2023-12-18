
const databaseId="65774a629b8a62a99b2"
const COLLECTION= (name)=>name==="USER"?"65774d0170a5d0e3dd0e":name==="TICKET"?"65774cf8a679baa1c202":null
export const urlbase=(name)=>`https://cloud.appwrite.io/v1/databases/${databaseId}/collections/${COLLECTION(name)}/documents`
export const headers = {
    "content-type": "application/json",
    "X-Appwrite-Response-Format":"1.4.0",
    "X-Appwrite-Project":"65774a38603d07ba8331"
}