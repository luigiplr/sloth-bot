// Types and crap
/* eslint-disable */
export const FileTypes = {
  BE: ["1000","4000","A000","C000","E000","2001","3001","5001","B001","C001","E001","1002","2002","3002","4002","5002","6002","8002","9002","A002","B002","D002","E002","0003","2003","4003","5003","9003","D003","0004","2004","5004","6004","8004","A004","D004","2005","3005","5005","7005","8005","A005","C005","0006","1006","3006","9006","D006","E006","1007","2007","3007","4007","5007","8007","9007","B007","C007","D007","E007","0008","3008","5008","6008","C008","E008","2009","3009","4009","5009","8009","A009","C009","E009","000A","100A","300A","500A","900A","C00A","D00A","100B","200B","400B","500B","900B","A00B","D00B","000C","400C","600C","800C","A00C","000D","200D","300D","400D","500D","900D","D00D","E00D","000E","100E","300E","500E","600E","800E","900E","A00E","E00E","100F","200F","300F","400F","500F","600F","800F","D00F","D005","A007","D008"],
  "LE": ["0010","0040","00A0","00C0","00E0","0120","0130","0150","01B0","01C0","01E0","0210","0220","0230","0240","0250","0260","0280","0290","02A0","02B0","02D0","02E0","0300","0320","0340","0350","0390","03D0","0400","0420","0450","0460","0480","04A0","04D0","0520","0530","0550","0570","0580","05A0","05C0","0600","0610","0630","0690","06D0","06E0","0710","0720","0730","0740","0750","0780","0790","07B0","07C0","07D0","07E0","0800","0830","0850","0860","08C0","08E0","0920","0930","0940","0950","0980","09A0","09C0","09E0","0A00","0A10","0A30","0A50","0A90","0AC0","0AD0","0B10","0B20","0B40","0B50","0B90","0BA0","0BD0","0C00","0C40","0C60","0C80","0CA0","0D00","0D20","0D30","0D40","0D50","0D90","0DD0","0DE0","0E00","0E10","0E30","0E50","0E60","0E80","0E90","0EA0","0EE0","0F10","0F20","0F30","0F40","0F50","0F60","0F80","0FD0","05D0","07A0","08D0"],
  "SWP": ["081","021","051","031","071","049","0C9","0A9","0D9","039","079","085","045","0C5","025","0A5","065","015","095","055","0D5","0B5","075","00D","04D","02D","0AD","09D","0BD","003","043","0A3","063","013","053","0B3","04B","0CB","0AB","0EB","01B","05B","03B","007","087","0C7","097","0B7","077","08F","04F","0CF","02F","0AF","01F","09F","0DF","03F","0BF","07F","002","0C2","0A2","062","032","072","04A","0CA","02A","0AA","01A","05A","03A","07A","006","086","0C6","0A6","096","036","0B6","08E","04E","02E","0AE","09E","05E","0BE","004","024","064","014","054","00C","04C","0CC","02C","0AC","09C","0BC","07C","008","088","0C8","0A8","068","018","098","058","078","090","050","0D0","030","0B0","070","020","0C0","0BB","05F","0B2"]
}

export const FileInfo = {
  "002": {
    "name": "Map Data",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "003": {
    "name": "EntityDefinition",
    "desc": "STUEntityDefinition",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "004": {
    "name": "Texture",
    "desc": "Sometimes has a corresponding 04D file",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "006": {
    "name": "Animation",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "007": {
    "name": "Skeleton",
    "desc": "Only has a teModelChunk_Skeleton (mskl) chunk",
    "state": null,
    "fileType": "Chunked",
    "removed": false
  },
  "008": {
    "name": "Material",
    "desc": "teMaterial",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "00C": {
    "name": "Model",
    "desc": null,
    "state": null,
    "fileType": "Chunked",
    "removed": false
  },
  "00D": {
    "name": "Effect",
    "desc": "GFX",
    "state": null,
    "fileType": "Chunked",
    "removed": false
  },
  "00E": {
    "name": "Light Data",
    "desc": null,
    "state": "Removed since 1.7.0.0",
    "fileType": null,
    "removed": true
  },
  "00F": {
    "name": "Shader Group Cache",
    "desc": null,
    "state": "Removed since 1.10.0.",
    "fileType": null,
    "removed": true
  },
  "010": {
    "name": "Display String",
    "desc": null,
    "state": "Removed",
    "fileType": null,
    "removed": true
  },
  "013": {
    "name": "DataFlow",
    "desc": "STUDataFlow",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "014": {
    "name": "AnimAlias",
    "desc": "STUAnimAlias",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "015": {
    "name": "AnimCategory",
    "desc": "STUAnimCategory",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "018": {
    "name": "AnimBoneWeightMask",
    "desc": "STUAnimBoneWeightMask",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "01A": {
    "name": "ModelLook",
    "desc": "STUModelLook",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "01B": {
    "name": "StatescriptGraph",
    "desc": "Defines the layout of a Statescipt script, STUStatescriptGraph",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "01F": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "020": {
    "name": "AnimBlendTree",
    "desc": "STUAnimBlendTree",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "021": {
    "name": "AnimBlendTreeSet",
    "desc": "STUAnimBlendTreeSet. Team4 sometimes calls this a \"blend tree template set\"",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "024": {
    "name": "Statescript Priority",
    "desc": "In m_priority",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "025": {
    "name": "GameMessage",
    "desc": "STUGameMessage",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "02A": {
    "name": "SoundFilter",
    "desc": "STUSoundFilter",
    "state": "Removed since 1.22",
    "fileType": "STU",
    "removed": true
  },
  "02B": {
    "name": null,
    "desc": null,
    "state": "Removed since 1.14.0.2",
    "fileType": "STU",
    "removed": true
  },
  "02C": {
    "name": "Sound",
    "desc": "STUSound",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "02D": {
    "name": "SoundSwitchGroup",
    "desc": "STUSoundSwitchGroup",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "02E": {
    "name": "SoundSwitch",
    "desc": "STUSoundSwitch",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "02F": {
    "name": "SoundParameter",
    "desc": "STUSoundParameter",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "030": {
    "name": "SoundStateGroup",
    "desc": "STUSoundStateGroup",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "031": {
    "name": "SoundState",
    "desc": "STUSoundState",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "032": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "033": {
    "name": null,
    "desc": null,
    "state": "Removed since 1.14.0.2",
    "fileType": "STU",
    "removed": true
  },
  "034": {
    "name": "Asset Thumbnail",
    "desc": null,
    "state": "Removed",
    "fileType": null,
    "removed": true
  },
  "036": {
    "name": "UXLink",
    "desc": "STUUXLink",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "039": {
    "name": "MapCatalog",
    "desc": "STUMapCatalog, binds 002 to 09F",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "03A": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "03B": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "03E": {
    "name": "Light Debug Data",
    "desc": null,
    "state": "Removed",
    "fileType": null,
    "removed": true
  },
  "03F": {
    "name": "SoundWEMFile",
    "desc": "WWise WEM",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "043": {
    "name": "SoundBank",
    "desc": "WWise BNK",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "045": {
    "name": "UXIDLookup",
    "desc": "STUUXIDLookup",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "049": {
    "name": "ContactSet",
    "desc": "STUContactSet",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "04A": {
    "name": "Effect",
    "desc": "Environment FX?",
    "state": null,
    "fileType": "Chunked",
    "removed": false
  },
  "04B": {
    "name": "JSON",
    "desc": "ca_bundle.txt.signed",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "04C": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "04D": {
    "name": "TexturePayload",
    "desc": "Has a corresponding 004 file",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "04E": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "04F": {
    "name": null,
    "desc": null,
    "state": "Removed in 1.22",
    "fileType": "STU",
    "removed": true
  },
  "050": {
    "name": "Font",
    "desc": "Wrapped TTF",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "051": {
    "name": "FontFamily",
    "desc": "STUFontFamily",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "053": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "054": {
    "name": "GenericSettings",
    "desc": "STUGenericSettings_Base, Random data",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "055": {
    "name": "SoundSpace",
    "desc": "STUSoundSpace",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "058": {
    "name": "ProgressionUnlocks",
    "desc": "STUProgressionUnlocks",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "05A": {
    "name": "UXScreen",
    "desc": "STUUXScreen",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "05B": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "05E": {
    "name": "UXResourceDictionary",
    "desc": "STUUXResourceDictionary",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "05F": {
    "name": "VoiceSet",
    "desc": "STUVoiceSet",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "062": {
    "name": "Stat",
    "desc": "STUStat",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "063": {
    "name": "Catalog",
    "desc": "STUCatalog",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "065": {
    "name": "MaterialEffect",
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "068": {
    "name": "Achievement",
    "desc": "STUAchievement",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "06F": {
    "name": "Sound Owner",
    "desc": null,
    "state": "Removed since 1.7.0.0",
    "fileType": null,
    "removed": true
  },
  "070": {
    "name": "VoiceLineSet",
    "desc": "STUVoiceLineSet",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "071": {
    "name": "Subtitle",
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "072": {
    "name": "LocaleSettings",
    "desc": "STULocaleSettings",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "075": {
    "name": "Hero",
    "desc": "STUHero",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "076": {
    "name": "Skin",
    "desc": "STUSkin",
    "state": "Removed in 1.3.0.0 (now virtual)",
    "fileType": null,
    "removed": true
  },
  "077": {
    "name": "AssetPackage",
    "desc": "teAssetPackage",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "078": {
    "name": "VoiceStimulus",
    "desc": "STUVoiceStimulus, a voice sound \"trigger\"",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "079": {
    "name": "VoiceCategory",
    "desc": "STUVoiceCategory",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "07A": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "07C": {
    "name": "UXDisplayString",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "07F": {
    "name": "Chat replacement",
    "desc": "\"gg ez\" => \"It's past my bedtime\"",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "081": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "085": {
    "name": "Shader Group",
    "desc": "Same structure as 088, pixel + vertex",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "086": {
    "name": "Shader Instance",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "087": {
    "name": "Shader Code",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "088": {
    "name": "Shader Source",
    "desc": "Same structure as 085. Different structure on dev builds?",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "08E": {
    "name": "Effect",
    "desc": "Unknown Effect",
    "state": null,
    "fileType": "Chunked",
    "removed": false
  },
  "08F": {
    "name": "Effect",
    "desc": "Animation Effect",
    "state": null,
    "fileType": "Chunked",
    "removed": false
  },
  "090": {
    "name": "ResourceKey",
    "desc": "STUResourceKey",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "095": {
    "name": "LogicalButton",
    "desc": "m_logicalButton",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "096": {
    "name": "System Mapping",
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "097": {
    "name": "RaycastType",
    "desc": "STURaycastType",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "098": {
    "name": "RaycastReceiver",
    "desc": "STURaycastReceiver",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "09B": {
    "name": "Sound Binding",
    "desc": null,
    "state": "Removed since 1.7.0.0",
    "fileType": null,
    "removed": true
  },
  "09C": {
    "name": "PackageBundle",
    "desc": "Binary stream, use package offsets to find files",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "09D": {
    "name": "Announcer",
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "09E": {
    "name": "Loadout",
    "desc": "STULoadout (ability or weapon)",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "09F": {
    "name": "MapHeader",
    "desc": "STUMapHeader",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0A1": {
    "name": null,
    "desc": null,
    "state": "Removed since 1.7.0.0",
    "fileType": null,
    "removed": true
  },
  "0A2": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0A3": {
    "name": "SoundIntegrity",
    "desc": "STUSoundIntegrity",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0A5": {
    "name": "Unlock",
    "desc": "STUUnlock",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0A6": {
    "name": "SkinTheme",
    "desc": "STUSkinTheme",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0A8": {
    "name": "EffectLook",
    "desc": "STUEffectLook",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0A9": {
    "name": "String",
    "desc": "Unlocalized",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0AA": {
    "name": "MapFont",
    "desc": "STUMapFont",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0AB": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0AC": {
    "name": "GamePadVibration",
    "desc": "STUGamePadVibration, controller vibration curves",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0AD": {
    "name": "HeroWeapon",
    "desc": "STUHeroWeapon, Skin weapon override",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0AE": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0AF": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0B0": {
    "name": "UXViewModelSchema",
    "desc": "STUUXViewModelSchema",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0B2": {
    "name": "VoiceWEMFile",
    "desc": "WWise WEM",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0B3": {
    "name": "MaterialData",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0B5": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0B6": {
    "name": "Movie",
    "desc": "Bink Video, has a 0BB file for Audio",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0B7": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0BB": {
    "name": "Video Audio",
    "desc": "WWise WEM",
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0BC": {
    "name": "Map Chunk",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0BD": {
    "name": "Lighting Manifest",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0BE": {
    "name": "Lighting Chunk",
    "desc": null,
    "state": null,
    "fileType": null,
    "removed": false
  },
  "0BF": {
    "name": "LineupPose",
    "desc": "STULineupPose",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0C0": {
    "name": "GameRuleset",
    "desc": "STUGameRuleset",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0C2": {
    "name": "Highlight Type",
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0C4": {
    "name": "Brawl Information",
    "desc": null,
    "state": "Removed in 1.5.0.0",
    "fileType": "STU",
    "removed": true
  },
  "0C5": {
    "name": "Game Mode",
    "desc": "STUGameMode",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0C6": {
    "name": "GameRulesetSchema",
    "desc": "STUGameRulesetSchema",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0C7": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0C8": {
    "name": "RankedSeason",
    "desc": "STURankedSeason",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0C9": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0CA": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0CB": {
    "name": "Shadow Data",
    "desc": null,
    "state": null,
    "fileType": "Chunked",
    "removed": false
  },
  "0CC": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0CE": {
    "name": "TeamColor",
    "desc": "STUTeamColor",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0CF": {
    "name": "LootBox",
    "desc": "STULootBox",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0D0": {
    "name": "VoiceConversation",
    "desc": "STUVoiceConversation",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0D5": {
    "name": "STUD/Description",
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0D6": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0D7": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0D9": {
    "name": "Brawl Name",
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0DF": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0EB": {
    "name": "Report Response",
    "desc": "The message when a player you reported is punished or when you are punished",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0EC": {
    "name": "League Team",
    "desc": "OWL team definition",
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0EE": {
    "name": null,
    "desc": null,
    "state": null,
    "fileType": "STU",
    "removed": false
  },
  "0F1": {
    "name": "Localized Texture",
    "desc": "Added in 1.22 -- Localized to selected language.",
    "state": null,
    "fileType": null,
    "removed": false
  }
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
  const typeEl = e.querySelector('td')
  const name =  e.querySelector('td:nth-of-type(2)').innerText.trim()
  const type = typeEl.innerText.trim()
  const desc = e.querySelector('td:nth-of-type(3)').innerText.trim()
  const state = e.querySelector('td:nth-of-type(4)').innerText.trim()
  const fileType = typeEl.querySelector('b') ? 'STU' : typeEl.querySelector('i') ? 'Chunked' : null
  const removed = !!typeEl.querySelector('s')

  out[type] = {
    name: name.length ? name : null,
    desc: desc.length ? desc : null,
    state: state.length ? state : null,
    fileType,
    removed
  }
})
*/
