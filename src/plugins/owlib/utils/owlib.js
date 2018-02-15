// Types and crap
export const FileTypes = {
  BE: ["1000","4000","A000","C000","E000","2001","3001","5001","B001","C001","E001","1002","2002","3002","4002","5002","6002","8002","9002","A002","B002","D002","E002","0003","2003","4003","5003","9003","D003","0004","2004","5004","6004","8004","A004","D004","2005","3005","5005","7005","8005","A005","C005","0006","1006","3006","9006","D006","E006","1007","2007","3007","4007","5007","8007","9007","B007","C007","D007","E007","0008","3008","5008","6008","C008","E008","2009","3009","4009","5009","8009","A009","C009","E009","000A","100A","300A","500A","900A","C00A","D00A","100B","200B","400B","500B","900B","A00B","D00B","000C","400C","600C","800C","A00C","000D","200D","300D","400D","500D","900D","D00D","E00D","000E","100E","300E","500E","600E","800E","900E","A00E","E00E","100F","200F","300F","400F","500F","600F","800F","D00F","D005","A007","D008"],
  LE: ["0010","0040","00A0","00C0","00E0","0120","0130","0150","01B0","01C0","01E0","0210","0220","0230","0240","0250","0260","0280","0290","02A0","02B0","02D0","02E0","0300","0320","0340","0350","0390","03D0","0400","0420","0450","0460","0480","04A0","04D0","0520","0530","0550","0570","0580","05A0","05C0","0600","0610","0630","0690","06D0","06E0","0710","0720","0730","0740","0750","0780","0790","07B0","07C0","07D0","07E0","0800","0830","0850","0860","08C0","08E0","0920","0930","0940","0950","0980","09A0","09C0","09E0","0A00","0A10","0A30","0A50","0A90","0AC0","0AD0","0B10","0B20","0B40","0B50","0B90","0BA0","0BD0","0C00","0C40","0C60","0C80","0CA0","0D00","0D20","0D30","0D40","0D50","0D90","0DD0","0DE0","0E00","0E10","0E30","0E50","0E60","0E80","0E90","0EA0","0EE0","0F10","0F20","0F30","0F40","0F50","0F60","0F80","0FD0","05D0","07A0","08D0"],
  SWP: ["081","021","051","031","071","049","0C9","0A9","0D9","039","079","085","045","0C5","025","0A5","065","015","095","055","0D5","0B5","075","00D","04D","02D","0AD","09D","0BD","003","043","0A3","063","013","053","0B3","04B","0CB","0AB","0EB","01B","05B","03B","007","087","0C7","097","0B7","077","08F","04F","0CF","02F","0AF","01F","09F","0DF","03F","0BF","07F","002","0C2","0A2","062","032","072","04A","0CA","02A","0AA","01A","05A","03A","07A","006","086","0C6","0A6","096","036","0B6","08E","04E","02E","0AE","09E","05E","0BE","004","024","064","014","054","00C","04C","0CC","02C","0AC","09C","0BC","07C","008","088","0C8","0A8","068","018","098","058","078","090","050","0D0","030","0B0","070","020","0C0","0BB","05F","0B2"]
}

export const FileInfo = {
  "002": { "name": "Map Data", "desc": null },
  "003": { "name": "Entity Definition", "desc": "STUEntityDefinition" },
  "004": { "name": "Texture", "desc": "Has a corresponding 04D file" },
  "006": { "name": "Animation", "desc": null },
  "007": { "name": "Skeleton", "desc": "Only has a lksm chunk" },
  "008": { "name": "Material", "desc": null },
  "00C": { "name": "Model", "desc": null },
  "00D": { "name": "Effect", "desc": "GFX" },
  "00E": { "name": "Light Data", "desc": "Removed since 1.7.0.0" },
  "00F": { "name": "Shader Group Cache", "desc": "Removed since 1.10.0." },
  "010": { "name": "Display String", "desc": "Removed" },
  "013": { "name": "Dataflow", "desc": "STUDataFlow" },
  "014": { "name": null, "desc": null },
  "015": { "name": "Animation Category", "desc": "STUAnimCategory" },
  "018": { "name": "Animation Bone Weight Mask", "desc": "STUAnimBoneWeightMask" },
  "01A": { "name": "Model Look", "desc": "STUModelLook" },
  "01B": { "name": "StateScript Graph", "desc": "Defines the layout of a Statescipt script, STUStatescriptGraph" },
  "01F": { "name": null, "desc": null },
  "020": { "name": "Animation Blend Tree", "desc": "STUAnimBlendTree" },
  "021": { "name": "Animation Blend Tree Set", "desc": "STUAnimBlendTreeSet" },
  "024": { "name": "Statescript Priority", "desc": "In m_priority" },
  "025": { "name": null, "desc": null },
  "02A": { "name": null, "desc": null },
  "02B": { "name": null, "desc": "Removed since 1.14.0.2" },
  "02C": { "name": "Sound", "desc": "STUSound" },
  "02D": { "name": null, "desc": null },
  "02E": { "name": "Sound Switch", "desc": null },
  "02F": { "name": "Sound Parameter", "desc": null },
  "030": { "name": null, "desc": null },
  "031": { "name": null, "desc": null },
  "032": { "name": null, "desc": null },
  "033": { "name": null, "desc": "Removed since 1.14.0.2" },
  "034": { "name": "Thumbnail", "desc": "Removed" },
  "036": { "name": "Native Reference", "desc": "Mostly blank?" },
  "039": { "name": "Map Catalog", "desc": "Binds 002 to 09F, STUMapCatalog" },
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
  "054": { "name": "Game Info", "desc": "Random data" },
  "055": { "name": null, "desc": null },
  "058": { "name": "Inventory List", "desc": null },
  "05A": { "name": "UX Screen", "desc": null },
  "05B": { "name": null, "desc": null },
  "05E": { "name": "User Interface", "desc": null },
  "05F": { "name": "Sound Master", "desc": "Documentation outdated since 1.7.0.0" },
  "062": { "name": "Statistic", "desc": "STUStat" },
  "063": { "name": "Collection", "desc": "STUCatalog" },
  "065": { "name": "Material Effect", "desc": null },
  "068": { "name": "Achievement", "desc": null },
  "06F": { "name": "Sound Owner", "desc": "Removed since 1.7.0.0" },
  "070": { "name": null, "desc": null },
  "071": { "name": "Subtitle", "desc": null },
  "072": { "name": "Locale Settings", "desc": "STULocaleSettings" },
  "075": { "name": "Hero", "desc": null },
  "076": { "name": "Texture Override Metadata", "desc": "Removed in 1.3.0.0" },
  "077": { "name": "Package", "desc": null },
  "078": { "name": "Voice Stimulus", "desc": "STUVoiceStimulus, Stored instead of sound GUID" },
  "079": { "name": "Voice Category", "desc": "m_category on 078, STUVoiceCategory" },
  "07A": { "name": null, "desc": null },
  "07C": { "name": "String", "desc": "Localized" },
  "07F": { "name": "Chat replacement", "desc": "\"gg ez\" => \"It's past my bedtime\"" },
  "081": { "name": null, "desc": null },
  "085": { "name": "Shader Definition", "desc": "Same structure as 088, pixel + vertex" },
  "086": { "name": "Shader Instance", "desc": null },
  "087": { "name": "Compiled Shader", "desc": null },
  "088": { "name": "Pixel Shader Definition", "desc": "Same structure as 085" },
  "08E": { "name": "Effect", "desc": "Unknown Effect" },
  "08F": { "name": "Effect", "desc": "Animation Effect" },
  "090": { "name": "Encryption Key", "desc": null },
  "095": { "name": "Logical Button", "desc": "m_logicalButton" },
  "096": { "name": "System Mapping", "desc": null },
  "097": { "name": null, "desc": null },
  "098": { "name": "Raycast", "desc": "STURaycastReceiver" },
  "09B": { "name": "Sound Binding", "desc": "Removed since 1.7.0.0" },
  "09C": { "name": "Bundle", "desc": "Binary stream, use package offsets to find files" },
  "09D": { "name": "Announcer", "desc": null },
  "09E": { "name": "Ability Info", "desc": null },
  "09F": { "name": "Map Metadata", "desc": null },
  "0A1": { "name": null, "desc": "Removed since 1.7.0.0" },
  "0A2": { "name": null, "desc": null },
  "0A3": { "name": null, "desc": null },
  "0A5": { "name": "Unlock", "desc": null },
  "0A6": { "name": "Skin Override", "desc": "Primary" },
  "0A8": { "name": "Effect Look", "desc": "STUEffectLook" },
  "0A9": { "name": "String", "desc": "Unlocalized" },
  "0AA": { "name": "Map Font", "desc": null },
  "0AB": { "name": null, "desc": null },
  "0AC": { "name": "Gamepad Vibration", "desc": "Gradient for vibrations" },
  "0AD": { "name": "Weapon Override", "desc": "Secondary, used for weapon skins" },
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
  "0BF": { "name": "Pose", "desc": "STULineupPose" },
  "0C0": { "name": "Game Ruleset", "desc": "STUGameRuleset" },
  "0C2": { "name": "Highlight Type", "desc": null },
  "0C4": { "name": "Brawl Information", "desc": "Removed in 1.5.0.0" },
  "0C5": { "name": "Game Mode", "desc": "STUGameMode" },
  "0C6": { "name": "Game Ruleset Schema", "desc": "STUGameRulesetSchema" },
  "0C7": { "name": null, "desc": null },
  "0C8": { "name": "Competitive Season", "desc": null },
  "0C9": { "name": null, "desc": null },
  "0CA": { "name": null, "desc": null },
  "0CB": { "name": "Shadow Data", "desc": null },
  "0CC": { "name": null, "desc": null },
  "0CF": { "name": "Lootbox Metadata", "desc": null },
  "0D0": { "name": "Voice Conversation Line(?)", "desc": "STUVoiceConversationLine" },
  "0D5": { "name": "STUD/Description", "desc": null },
  "0D9": { "name": "Brawl Name", "desc": null },
  "0DF": { "name": null, "desc": null },
  "0EB": { "name": "Report Response", "desc": "The message when a player you reported is punished or when you are punished" }
}

/**
 * Generate File Types
 * 
document.body.innerText
  .split('\n')
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