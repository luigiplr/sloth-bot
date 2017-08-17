// Types and crap
export const FileTypes = {
  BE: ["0003","0004","0006","0008","000A","000C","000D","000E","1000","1002","1006","1007","100A","100B","100E","100F","2001","2002","2003","2004","2005","2007","2009","200B","200D","200F","3001","3002","3005","3006","3007","3008","3009","300A","300D","300E","300F","4000","4002","4003","4005","4007","4009","400B","400C","400D","400F","5001","5002","5003","5004","5005","5007","5008","5009","500A","500B","500D","500E","500F","6002","6004","6008","600E","600F","8002","8004","8005","8007","8009","800C","800E","800F","9002","9003","9006","9007","900A","900B","900D","900E","A000","A002","A004","A005","A007","A009","A00B","A00C","A00E","B001","B002","C000","C001","C004","C005","C007","C008","C009","C00A","D002","D003","D004","D005","D006","D007","D008","D00A","D00B","D00D","D00F","E000","E001","E002","E006","E007","E008","E009","E00D","E00E"],
  LE: ["0300","0400","0600","0800","0A00","0C00","0D00","0E00","0010","0210","0610","0710","0A10","0B10","0E10","0F10","0120","0220","0320","0420","0520","0720","0920","0B20","0D20","0F20","0130","0230","0530","0630","0730","0830","0930","0A30","0D30","0E30","0F30","0040","0240","0340","0540","0740","0940","0B40","0C40","0D40","0F40","0150","0250","0350","0450","0550","0750","0850","0950","0A50","0B50","0D50","0E50","0F50","0260","0460","0860","0E60","0F60","0280","0480","0580","0780","0980","0C80","0E80","0F80","0290","0390","0690","0790","0A90","0B90","0D90","0E90","00A0","02A0","04A0","05A0","07A0","09A0","0BA0","0CA0","0EA0","01B0","02B0","00C0","01C0","04C0","05C0","07C0","08C0","09C0","0AC0","02D0","03D0","04D0","05D0","06D0","07D0","08D0","0AD0","0BD0","0DD0","0FD0","00E0","01E0","02E0","06E0","07E0","08E0","09E0","0DE0","0EE0"],
  SWP: ["00D","003","007","002","006","004","00C","008","081","085","087","08F","086","08E","088","090","049","045","04D","043","04B","04F","04A","04E","04C","050","0C9","0C5","0CB","0C7","0CF","0C2","0CA","0C6","0CC","0C8","0D0","021","025","02D","02B","02F","02A","02E","024","02C","030","0A9","0A5","0AD","0A3","0AB","0AF","0A2","0AA","0A6","0AE","0AC","0A8","0B0","065","063","062","068","070","015","013","01B","01F","01A","014","018","020","095","09D","097","09F","096","09E","09C","098","051","055","053","05B","05F","05A","05E","054","058","0D9","0D5","031","039","033","03B","03F","032","03A","036","0B5","0BD","0B3","0BB","0B7","0BF","0B2","0B6","0BE","0BC","0C0","071","079","075","077","07F","072","07A","07C","078"]
}

export const FileInfo = {
  "002": { "name": "Map Data", "desc": null },
  "003": { "name": "StateScript Component", "desc": null },
  "004": { "name": "Texture", "desc": "Has a corresponding 04D file" },
  "006": { "name": "Animation", "desc": null },
  "007": { "name": "Skeleton", "desc": "Only has a lksm chunk" },
  "008": { "name": "Material", "desc": null },
  "00C": { "name": "Model", "desc": null },
  "00D": { "name": "Effect", "desc": "GFX" },
  "00E": { "name": "Light Data", "desc": "Removed since 1.7.0.0" },
  "00F": { "name": "Shader Group Cache", "desc": "Removed since 1.10.0." },
  "010": { "name": "Display String", "desc": "Removed" },
  "013": { "name": "Dataflow", "desc": null },
  "014": { "name": null, "desc": null },
  "015": { "name": null, "desc": null },
  "018": { "name": null, "desc": null },
  "01A": { "name": "Material Metadata", "desc": null },
  "01B": { "name": "StateScript Instance", "desc": null },
  "01F": { "name": null, "desc": null },
  "020": { "name": "Animation List", "desc": "Secondary" },
  "021": { "name": "Animation List", "desc": "Primary" },
  "024": { "name": null, "desc": null },
  "025": { "name": null, "desc": null },
  "02A": { "name": null, "desc": null },
  "02B": { "name": null, "desc": "Removed since 1.14.0.2" },
  "02C": { "name": "Soundbank Master", "desc": null },
  "02D": { "name": null, "desc": null },
  "02E": { "name": "Sound Switch", "desc": null },
  "02F": { "name": "Sound Parameter", "desc": null },
  "030": { "name": null, "desc": null },
  "031": { "name": null, "desc": null },
  "032": { "name": null, "desc": null },
  "033": { "name": null, "desc": "Removed since 1.14.0.2" },
  "034": { "name": "Thumbnail", "desc": "Removed" },
  "036": { "name": "Native Reference", "desc": "Mostly blank?" },
  "039": { "name": null, "desc": null },
  "03A": { "name": null, "desc": null },
  "03B": { "name": null, "desc": null },
  "03E": { "name": "Light Debug Data", "desc": "Removed" },
  "03F": { "name": "SFX/Music", "desc": "WWise WEM" },
  "043": { "name": "Soundbank", "desc": "WWise BNK" },
  "045": { "name": "Database", "desc": " ?" },
  "049": { "name": null, "desc": null },
  "04A": { "name": "Effect", "desc": "Environment FX?" },
  "04B": { "name": "JSON", "desc": "ca_bundle.txt.signed" },
  "04C": { "name": null, "desc": null },
  "04D": { "name": "Texture Payload", "desc": "Has a corresponding 004 file" },
  "04E": { "name": null, "desc": null },
  "04F": { "name": null, "desc": null },
  "050": { "name": "Font", "desc": "Wrapped" },
  "051": { "name": null, "desc": null },
  "053": { "name": null, "desc": null },
  "054": { "name": "Game Info", "desc": null },
  "055": { "name": null, "desc": null },
  "058": { "name": "Inventory List", "desc": null },
  "05A": { "name": "UX Screen", "desc": null },
  "05B": { "name": null, "desc": null },
  "05E": { "name": "User Interface", "desc": null },
  "05F": { "name": "Sound Master", "desc": "Documentation outdated since 1.7.0.0" },
  "062": { "name": "Statistic", "desc": null },
  "063": { "name": "Collection", "desc": null },
  "065": { "name": null, "desc": null },
  "068": { "name": "Achievement", "desc": null },
  "06F": { "name": "Sound Owner", "desc": "Removed since 1.7.0.0" },
  "070": { "name": null, "desc": null },
  "071": { "name": "Subtitle", "desc": null },
  "072": { "name": null, "desc": null },
  "075": { "name": "Hero", "desc": null },
  "076": { "name": "Texture Override Metadata", "desc": "Removed in 1.3.0.0" },
  "077": { "name": "Package", "desc": null },
  "078": { "name": null, "desc": null },
  "079": { "name": null, "desc": null },
  "07A": { "name": null, "desc": null },
  "07C": { "name": "String", "desc": "Localized" },
  "07F": { "name": null, "desc": null },
  "081": { "name": null, "desc": null },
  "085": { "name": "Shader Group", "desc": null },
  "086": { "name": "Shader Instance", "desc": null },
  "087": { "name": "Compiled Shader", "desc": null },
  "088": { "name": "Shader Code", "desc": null },
  "08E": { "name": "Effect", "desc": "Animation related FX" },
  "08F": { "name": null, "desc": null },
  "090": { "name": "Encryption Key", "desc": null },
  "095": { "name": null, "desc": null },
  "096": { "name": "System Mapping", "desc": null },
  "097": { "name": null, "desc": null },
  "098": { "name": null, "desc": null },
  "09B": { "name": "Sound Binding", "desc": "Removed since 1.7.0.0" },
  "09C": { "name": "Bundle", "desc": "Binary stream, use package offsets to find files" },
  "09D": { "name": "Announcer", "desc": null },
  "09E": { "name": "Ability Info", "desc": null },
  "09F": { "name": "Map Metadata", "desc": null },
  "0A1": { "name": null, "desc": "Removed since 1.7.0.0" },
  "0A2": { "name": null, "desc": null },
  "0A3": { "name": null, "desc": null },
  "0A5": { "name": "Item", "desc": null },
  "0A6": { "name": "Override", "desc": "Primary" },
  "0A8": { "name": "Decal", "desc": null },
  "0A9": { "name": "String", "desc": "Unlocalized" },
  "0AA": { "name": null, "desc": null },
  "0AB": { "name": null, "desc": null },
  "0AC": { "name": null, "desc": null },
  "0AD": { "name": "Override", "desc": "Secondary, used for weapon skins" },
  "0AE": { "name": null, "desc": null },
  "0AF": { "name": null, "desc": null },
  "0B0": { "name": "UX View Schema", "desc": null },
  "0B2": { "name": "Voice", "desc": "WWise WEM" },
  "0B3": { "name": "Material Data", "desc": null },
  "0B5": { "name": null, "desc": null },
  "0B6": { "name": "Bink Video", "desc": "Has a 0BB file for Audio" },
  "0B7": { "name": null, "desc": null },
  "0BB": { "name": "Video Audio", "desc": "WWise WEM" },
  "0BC": { "name": "Map Chunk", "desc": null },
  "0BD": { "name": "Lighting Manifest", "desc": null },
  "0BE": { "name": "Lighting Chunk", "desc": null },
  "0BF": { "name": "Pose", "desc": null },
  "0C0": { "name": null, "desc": "Removed in 1.4.0.0 - Returned in 1.7.0.0" },
  "0C2": { "name": "Highlight Type", "desc": null },
  "0C4": { "name": "Brawl Information", "desc": "Removed in 1.5.0.0" },
  "0C5": { "name": null, "desc": null },
  "0C6": { "name": "Custom Gamemode Parameter", "desc": null },
  "0C7": { "name": null, "desc": null },
  "0C8": { "name": null, "desc": null },
  "0C9": { "name": null, "desc": null },
  "0CA": { "name": null, "desc": null },
  "0CB": { "name": "Shadow Data", "desc": null },
  "0CC": { "name": null, "desc": null },
  "0CF": { "name": "Lootbox Metadata", "desc": null },
  "0D0": { "name": null, "desc": null },
  "0D5": { "name": "STUD/Description", "desc": null },
  "0D9": { "name": "Brawl Name", "desc": null },
  "0DF": { "name": null, "desc": null }
}

/**
 * Generate File Types
 * 
document.body.innerText
  .split('\n')
  .slice(1)
  .reduce((res, thing) => {
    const [be, le, swp] = thing.split(' : ')
    res.BE.push(be)
    res.LE.push(le)
    res.SWP.push(swp)
    return res
  }, {BE: [], LE: [], SWP: []})
 */

 /**
 * Generate File Info
 * 
var out = {}

document.querySelector('#mw-content-text .wikitable').querySelectorAll('tr').forEach((e, i) => {
  if (i == 0) return
  const type = e.querySelector('td').innerText.trim()
  const name = e.querySelector('td:nth-of-type(2)').innerText
  const desc = e.querySelector('td:nth-of-type(3)').innerText
  out[type] = { name: name.length ? name : null, desc: desc.length ? desc : null }
})
 */