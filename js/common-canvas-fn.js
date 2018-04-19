MaintainStorageIntegrity();
Resize();

var KimonoType = GetKimonoType();
var SleeveLength = GetSleeveLength(KimonoType);

var Canvas = "";
var Context = "";

var ImageQueue = [];
var ImageCount = 0;

var TriggeredByCollapse = false;

function SetCanvasValue(page, value) {
    ImageQueue = [];
    ImageCount = 0;
    $(".selected").removeClass("selected");

    if (IsAlreadySelected(page, value)) {
        ClearScenarioValue(page);
        ClearScenarioImage(page);
        WipeCanvas();
        PaintImage(GetPreviousPage(page));
        $(".next-btn").attr("disabled", true);
    } else {
        $("#" + value).addClass("selected");
        SetScenarioValue(page, value);
        WipeCanvas();
        var Image = GetCanvasImage(page, value);
        if (Image) {
            SetScenarioImage(page, Image);
        }
        PaintImage(page);
        $(".next-btn").attr("disabled", false);
    }
}

function WipeCanvas() {
    Context.clearRect(0, 0, Canvas.width, Canvas.height);
}

function DrawLoadedImages() {
    ImageQueue.forEach(function(Image){
        Context.drawImage(Image, 0, 0, Canvas.width, Canvas.height);
    });
}

function PaintImage(page) {

    if (page == "Material") {
        PaintMaterial();
    } else if (page == "Obi") {
        PaintObi();
    } else if (page == "Pattern" || page == "Final") {
        PaintPattern();
    } else {
        DrawBaseLayers(true);
    }
    
}

function PaintMaterial() {
    var Material = ScenarioValues.Material.Value;
    var Image = ScenarioValues.Material.Image;
    var DrawJuban = Material == "";
    
    if (Image != "") {
        ImageQueue.push(DrawImage(Image));
    }

    DrawBaseLayers(DrawJuban);
}

function DrawBaseLayers(DrawJuban) {

    if (DrawJuban) {
        ImageQueue.push(DrawImage("./Images/Mannequin/juban.png"));
    }

    ImageQueue.push(DrawImage("./Images/Mannequin/mannequin.png"));

}

function DrawImage(Src) {

    var Image = new window.Image();
    Canvas = document.getElementById("DressingRoom");
    
    var Ratio = 0.77294;

    Image.onload = function() {
        ImageCount++;
        if (ImageCount == ImageQueue.length) {
            DrawLoadedImages();
        }
    }
  
    Image.src = Src;

    return Image;
}

function PaintObi() {
    var MaterialImage = ScenarioValues.Material.Image;
    var ObiImage = ScenarioValues.Obi.Image;

    ImageQueue.push(DrawImage(MaterialImage));
    if (ObiImage != "") {
        ImageQueue.push(DrawImage(ObiImage));
    }

    DrawBaseLayers();

}

function PaintPattern() {
    var MaterialImage = ScenarioValues.Material.Image;
    var ObiImage = ScenarioValues.Obi.Image;
    var PatternImage = ScenarioValues.Pattern.Image;

    ImageQueue.push(DrawImage(MaterialImage));
    if (ObiImage != "") {
        ImageQueue.push(DrawImage(ObiImage));
    }

    if (PatternImage != "") {
        ImageQueue.push(DrawImage(PatternImage));
    }

    DrawBaseLayers();
}

function GetCanvasImage(page, value) {

    if (page == "Material") {
        return GetMaterialImage();
    } else if (page == "Obi") {
        return GetObiImage();
    } else if (page == "Pattern") {
        return GetPatternImage();
    } else {
        return false;
    }
}

function GetMaterialImage() {
    var MaterialImages = {
        Long: {
            Awase: {
                Autumn: "fall_long-sleeve_awase.png",
                Spring: "spring_long-sleeve_awase.png",
                Winter: "winter_long-sleeve_awase.png"
            },
            Hitoe: {
                Autumn: "fall_long-sleeve_hitoe.png",
                Summer: "summer_long-sleeve_hitoe.png"
            },
            Usumono: {
                Summer: "summer_long-sleeve_usumono.png"
            }
        },
        Short: {
            Awase: {
                Autumn: "fall_short-sleeve_awase.png",
                Spring: "spring_short-sleeve_awase.png",
                Winter: "winter_short-sleeve_awase.png"                   
            },
            Hitoe: {
                Autumn: "fall_short-sleeve_hitoe.png",
                Summer: "summer_short-sleeve_hitoe.png"
            },
            Usumono: {
                Summer: "summer_short-sleeve_usumono.png"
            }
        }
    };

    var Season = ScenarioValues.Season.Value;
    var Material = ScenarioValues.Material.Value;

    return "./Images/Kimonos/" + MaterialImages[SleeveLength][Material][Season];
}

function GetObiImage() {
    var Obis = {
        Summer: "summer_obi.png",
        Spring: "spring_obi.png",
        Autumn: "fall_obi.png",
        Winter: "winter_obi.png"
    }

    var Season = ScenarioValues.Season.Value;

    return "./Images/Obi/" + Obis[Season];
}

function GetPatternImage() {

    var Material = ScenarioValues.Material.Value;
    var Season = ScenarioValues.Season.Value;
    var Pattern = ScenarioValues.Pattern.Value;

    var PatternData = {
        "Tsukesage": {
            Autumn: {
                AutumnGrass: "autumn_grass_fall_tsukesage_" + Material.toLowerCase() + ".png",
                Butterfly: "butterfly_fall_tsukesage_" + Material.toLowerCase() + ".png",
                Chrysanthemum: "chrysanthemum_fall_tsukesage_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_fall_tsukesage_" + Material.toLowerCase() + ".png",
                Susuki: "long_grass_fall_tsukesage_" + Material.toLowerCase() + ".png",
                MapleLeaf: "maple_leaf_fall_tsukesage_" + Material.toLowerCase() + ".png"
            },
            Summer: {
                Bamboo: "bamboo_summer_tsukesage.png",
                Butterfly: "butterfly_summer_tsukesage.png",
                CraneTurtle: "crane-turtle_summer_tsukesage.png",
                Iris: "iris_summer_tsukesage.png",
                Matsu: "matsu_summer_tsukesage.png"
            },
            Spring: {
                Butterfly: "butterfly_spring_tsukesage_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_spring_tsukesage_" + Material.toLowerCase() + ".png",
                Iris: "iris_spring_tsukesage_" + Material.toLowerCase() + ".png",
                GreenMapleLeaf: "maple_leaf_spring_tsukesage_" + Material.toLowerCase() + ".png",
                Peony: "peony_spring_tsukesage_" + Material.toLowerCase() + ".png",
                Sakura: "sakura_spring_tsukesage_" + Material.toLowerCase() + ".png"
            },
            Winter: {
                Butterfly: "butterfly_winter_tsukesage_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_winter_tsukesage_" + Material.toLowerCase() + ".png",
                Matsu: "matsu_winter_tsukesage_" + Material.toLowerCase() + ".png",
                MatsuPlumBamboo: "matsu-plum-bamboo_winter_tsukesage_" + Material.toLowerCase() + ".png",
                Plum: "plum_winter_tsukesage_" + Material.toLowerCase() + ".png",
                Tsubaki: "tsubaki_winter_tsukesage_" + Material.toLowerCase() + ".png"
            }
        },
        "Iro-tomesode": {
            Autumn: {
                AutumnGrass: "autumn_grass_fall_iro-tomesode_" + Material.toLowerCase() + ".png",
                Butterfly: "butterfly_fall_iro-tomesode_" + Material.toLowerCase() + ".png",
                Chrysanthemum: "chrysanthemum_fall_iro-tomesode_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_fall_iro-tomesode_" + Material.toLowerCase() + ".png",
                Susuki: "long_grass_fall_iro-tomesode_" + Material.toLowerCase() + ".png",
                MapleLeaf: "maple_leaf_fall_iro-tomesode_" + Material.toLowerCase() + ".png"
            },
            Summer: {
                Bamboo: "bamboo_summer_iro-tomesode.png",
                Butterfly: "butterfly_summer_iro-tomesode.png",
                CraneTurtle: "crane-turtle_summer_iro-tomesode.png",
                Iris: "iris_summer_iro-tomesode.png",
                Matsu: "matsu_summer_iro-tomesode.png"  
            },
            Spring: {
                Butterfly: "butterfly_spring_iro-tomesode_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_spring_iro-tomesode_" + Material.toLowerCase() + ".png",
                Iris: "iris_spring_iro-tomesode_" + Material.toLowerCase() + ".png",
                GreenMapleLeaf: "maple_leaf_spring_iro-tomesode_" + Material.toLowerCase() + ".png",
                Peony: "peony_spring_iro-tomesode_" + Material.toLowerCase() + ".png",
                Sakura: "sakura_spring_iro-tomesode_" + Material.toLowerCase() + ".png"
            },
            Winter: {
                Butterfly: "butterfly_winter_iro-tomesode_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_winter_iro-tomesode_" + Material.toLowerCase() + ".png",
                Matsu: "matsu_winter_iro-tomesode_" + Material.toLowerCase() + ".png",
                MatsuPlumBamboo: "matsu-plum-bamboo_winter_iro-tomesode_" + Material.toLowerCase() + ".png",
                Plum: "plum_winter_iro-tomesode_" + Material.toLowerCase() + ".png",
                Tsubaki: "tsubaki_winter_iro-tomesode_" + Material.toLowerCase() + ".png"   
            }
        },
        "Houmongi": {
            Autumn: {
                AutumnGrass: "autumn_grass_fall_houmongi_" + Material.toLowerCase() + ".png",
                Butterfly: "butterfly_fall_houmongi_" + Material.toLowerCase() + ".png",
                Chrysanthemum: "chrysanthemum_fall_houmongi_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_fall_houmongi_" + Material.toLowerCase() + ".png",
                Susuki: "long_grass_fall_houmongi_" + Material.toLowerCase() + ".png",
                MapleLeaf: "maple_leaf_fall_houmongi_" + Material.toLowerCase() + ".png"                   
            }, 
            Summer: {
                Bamboo: "bamboo_summer_houmongi.png",
                Butterfly: "butterfly_summer_houmongi.png",
                CraneTurtle: "crane-turtle_summer_houmongi.png",
                Iris: "iris_summer_houmongi.png",
                Matsu: "matsu_summer_houmongi.png"
            },
            Spring: {
                Butterfly: "butterfly_spring_houmongi_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_spring_houmongi_" + Material.toLowerCase() + ".png",
                Iris: "iris_spring_houmongi_" + Material.toLowerCase() + ".png",
                GreenMapleLeaf: "maple_leaf_spring_houmongi_" + Material.toLowerCase() + ".png",
                Peony: "peony_spring_iro-houmongi_" + Material.toLowerCase() + ".png",
                Sakura: "sakura_spring_houmongi_" + Material.toLowerCase() + ".png"
            },
            Winter: {
                Butterfly: "butterfly_winter_houmongi_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_winter_houmongi_" + Material.toLowerCase() + ".png",
                Matsu: "matsu_winter_houmongi_" + Material.toLowerCase() + ".png",
                MatsuPlumBamboo: "matsu-plum-bamboo_winter_houmongi_" + Material.toLowerCase() + ".png",
                Plum: "plum_winter_houmongi_" + Material.toLowerCase() + ".png",
                Tsubaki: "tsubaki_winter_houmongi_" + Material.toLowerCase() + ".png"   
            }
        },
        "Furi-sode": {
            Autumn: {
                AutumnGrass: "autumn_grass_fall_furisode_" + Material.toLowerCase() + ".png",
                Butterfly: "butterfly_fall_furisode_" + Material.toLowerCase() + ".png",
                Chrysanthemum: "chrysanthemum_fall_furisode_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_fall_furisode_" + Material.toLowerCase() + ".png",
                Susuki: "long_grass_fall_furisode_" + Material.toLowerCase() + ".png",
                MapleLeaf: "maple_leaf_fall_furisode_" + Material.toLowerCase() + ".png"                    
            },
            Summer: {
                Bamboo: "bamboo_summer_furisode.png",
                Butterfly: "butterfly_summer_furisode.png",
                CraneTurtle: "crane-turtle_summer_furisode.png",
                Iris: "iris_summer_furisode.png",
                Matsu: "matsu_summer_furisode.png"  
            },
            Spring: {
                Butterfly: "butterfly_spring_furisode_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_spring_furisode_" + Material.toLowerCase() + ".png",
                Iris: "iris_spring_furisode_" + Material.toLowerCase() + ".png",
                Peony: "peony_spring_furisode_" + Material.toLowerCase() + ".png",
                Sakura: "sakura_spring_furisode_" + Material.toLowerCase() + ".png",
                GreenMapleLeaf: "maple_leaf_spring_furisode_" + Material.toLowerCase() + ".png"  
            },
            Winter: {
                Butterfly: "butterfly_winter_furisode_" + Material.toLowerCase() + ".png",
                CraneTurtle: "crane-turtle_winter_furisode_" + Material.toLowerCase() + ".png",
                Matsu: "matsu_winter_furisode_" + Material.toLowerCase() + ".png",
                MatsuPlumBamboo: "matsu-plum-bamboo_winter_furisode_" + Material.toLowerCase() + ".png",
                Plum: "plum_winter_furisode_" + Material.toLowerCase() + ".png",
                Tsubaki: "tsubaki_winter_furisode_" + Material.toLowerCase() + ".png"      
            }
        }
    };

    return "./Images/Motifs/" + PatternData[KimonoType][Season][Pattern];
}

function GetKimonoType() {
    var KimonoType = "";
    var Formality = ScenarioValues.Formality.Value;
    var MaritalStatus = ScenarioValues.Marital.Value;
    
    if (Formality == "SemiFormal") {
        KimonoType = "Tsukesage";
    } else {
        if (MaritalStatus == "Married") {
            KimonoType = "Iro-tomesode";
        } else {
            KimonoType = "Furi-sode";        
        }
    }

    return KimonoType;
}

function GetSleeveLength(KimonoType) {
    return KimonoType == "Furi-sode" ? "Long" : "Short";
}

function SetClickables (Page) {
    if (Page == "Material") {
        SetMaterialClickables();
    } else if (Page == "Obi") {
        SetObiClickables();
    } else if (Page == "Pattern") {
        SetPatternClickables();
    }
}

function ObiAlert(Season, Correct) {

    if (Correct) {

        if (ScenarioValues.Obi.Value != "") {

            $("#ObiModal .modal-title").text("ATARI (CORRECT)!");
            $("#obi-alert").text("You chose an obi that matches your kimono!");

            AddClassIfNotThere("#ObiModal .modal-header", "correct");
            $("#ObiModal").modal("show");

        }

    } else {

        $("#ObiModal .modal-title").text("MŌ ICHIDO (TRY AGAIN)");
        $("#ObiModal .modal-header").removeClass("correct");

        $("#obi-alert").text("Choose the obi that matches the colour of your kimono.");
        $("#ObiModal").modal('show');
    }
}

function SetObiClickables() {
    var Season = ScenarioValues.Season.Value;
    var Seasons = ["Summer", "Spring", "Winter", "Autumn"];
    for (var i = 0; i < Seasons.length; i++) {
        var ThisSeason = Seasons[i];

        if (ThisSeason == Season) {
            $('#' + ThisSeason).on('click', function() { 
                SetCanvasValue('Obi', this.id); 
                ObiAlert(this.id, true);
            });
            $('#' + ThisSeason + "-coll").on('click', function() { 
                SetCanvasValue('Obi', this.id.replace("-coll", ""));
                ObiAlert(this.id, true); 
            });
        } else {
            //Set click alert with material name and reason(s)
            document.getElementById(ThisSeason).onclick = function(){ 
                ObiAlert(this.id, false);
             };
            document.getElementById(ThisSeason + "-coll").onclick = function(){ 
                ObiAlert(this.id.replace("-coll", ""), false); 
            };
        }
    }
}

function GetClickableMaterialsThisSeason(PermittedMaterials, Season) {
    var MaterialDict = {};

    var MaterialsThisSeason = PermittedMaterials[Season];
    var LongMaterials = MaterialsThisSeason.Long;
    var ShortMaterials = MaterialsThisSeason.Short;

    for (var i = 0; i < LongMaterials.length; i++) {
        MaterialDict[LongMaterials[i]] = "";
    }

    for (var i = 0; i < ShortMaterials.length; i++) {
        MaterialDict[ShortMaterials[i]] = "";
    }

    return Object.keys(MaterialDict);
    
}

function GetClickableMaterialsBySleeve(PermittedMaterials, Season, SleeveLength) {
    return PermittedMaterials[Season][SleeveLength];
}

function SetMaterialClickables() {
    var PermittedMaterials = GetPermittedMaterials();

    var Season = ScenarioValues.Season.Value;
    var ClickableMaterialsThisSeason = GetClickableMaterialsThisSeason(PermittedMaterials, Season);
    var ClickableMaterialsBySleeve = GetClickableMaterialsBySleeve(PermittedMaterials, Season, SleeveLength);

    //Reason list is x-season and/or x-sleeve, or false (no reason to remove)
    var ReasonList = {
        "Awase": ["x-season", "x-sleeve"],
        "Hitoe": ["x-season", "x-sleeve"],
        "Usumono": ["x-season", "x-sleeve"]
    }

    var Material = "";
    for (var i = 0; i < ClickableMaterialsThisSeason.length; i++) {
        Material = ClickableMaterialsThisSeason[i];
        ReasonList[Material].shift();
    }

    for (var i = 0; i < ClickableMaterialsThisSeason.length; i++) {
        Material = ClickableMaterialsThisSeason[i];
        if (ReasonList[Material] > 1) {
            ReasonList[Material] = ["x-season"];
        } else {
            ReasonList[Material] = false;
        }
    }

    var Materials = Object.keys(ReasonList);
    localStorage.setItem("Reasons", JSON.stringify(ReasonList));

    for (var i = 0; i < Materials.length; i++) {
        var ThisMaterial = Materials[i];
        var Reasons = ReasonList[Materials[i]];

        if (!Reasons) {
            $('#' + ThisMaterial).on('click', function() { 
                SetCanvasValue('Material', this.id); 
                MaterialAlert(this.id, true);
            });
        } else {
            //Set click alert with material name and reason(s)
            document.getElementById(ThisMaterial).onclick = function(){ 
                MaterialAlert(this.id, false); 
            };
        }
    }
}

function SetPatternClickables() {
    var ReasonList = {
        AutumnGrass: ["x-material", "x-season"],
        Bamboo: ["x-material", "x-season"],
        Butterfly: ["x-material", "x-season"],
        Chrysanthemum: ["x-material", "x-season"],
        CraneTurtle: ["x-material", "x-season"],
        Iris: ["x-material", "x-season"],
        Susuki: ["x-material", "x-season"],
        MapleLeaf: ["x-material", "x-season"],
        GreenMapleLeaf: ["x-material", "x-season"],
        Matsu: ["x-material", "x-season"],
        MatsuPlumBamboo: ["x-material", "x-season"],
        Peony: ["x-material", "x-season"],
        Plum: ["x-material", "x-season"],
        Sakura: ["x-material", "x-season"],
        Tsubaki: ["x-material", "x-season"]
    }

    var ClickablePatternsThisSeason = GetClickablePatternsThisSeason();
    var ClickablePatternsByMaterial = GetClickablePatternsByMaterial();

    var Pattern = "";
    for (var i = 0; i < ClickablePatternsByMaterial.length; i++) {
        Pattern = ClickablePatternsByMaterial[i];
        ReasonList[Pattern].shift();
    }


    for (var i = 0; i < ClickablePatternsThisSeason.length; i++) {
        Pattern = ClickablePatternsThisSeason[i];
        if (ReasonList[Pattern] > 1) {
            ReasonList[Pattern] = ["x-season"];
        } else {
            ReasonList[Pattern] = false;
        }
    }

    var Patterns = Object.keys(ReasonList);
    localStorage.setItem("Reasons", JSON.stringify(ReasonList));
    
    for (var i = 0; i < Patterns.length; i++) {
        var ThisPattern = Patterns[i];
        var Reasons = ReasonList[ThisPattern];

        if (!Reasons) {
            $('#' + ThisPattern).on('click', function() { PatternDetail(this.id, true, this.src); });
            $('#' + ThisPattern + "-coll").on('click', function() { PatternDetail(this.id.replace("-coll", ""), true, this.src); });
        } else {
            //Set click alert with material name and reason(s)
            document.getElementById(ThisPattern).onclick = function(){ PatternDetail(this.id, false, this.src); };
            document.getElementById(ThisPattern+"-coll").onclick = function(){ PatternDetail(this.id.replace("-coll", ""), false, this.src); };
        }
    }
}

function PatternDetail(Pattern, Allowed, Source) {

    if (ScenarioValues.Pattern.Value != Pattern) {
        $('.modal-img').attr('src', Source);
        $('.modal-title').html(TextDict[Pattern + " Title"]);
        $('#pattern-detail').html(TextDict[Pattern]);

        $('#ChooseBtn').off("click");

        if (!Allowed) {
            $('#ChooseBtn').on("click", function() { PatternAlert(Pattern); });
        } else {
            $('#ChooseBtn').on("click", function() { 
                SetCanvasValue('Pattern', Pattern);
             });
        }

        $("#DetailModal").modal("show");
    } else {
        SetCanvasValue('Pattern', Pattern);
    }
}

function GetClickablePatternsThisSeason() {
    var Season = ScenarioValues.Season.Value;

    var AllowablePatterns = {
        Summer: ["Bamboo", "Butterfly", "CraneTurtle", "Iris", "Matsu"],
        Autumn: ["AutumnGrass", "Butterfly", "Chrysanthemum", "CraneTurtle", "Susuki", "MapleLeaf"],
        Spring: ["Butterfly", "CraneTurtle", "Iris", "GreenMapleLeaf", "Peony", "Sakura"],
        Winter: ["Butterfly", "CraneTurtle", "Matsu", "MatsuPlumBamboo", "Plum", "Tsubaki"]
    }

    return AllowablePatterns[Season];
}

function GetClickablePatternsByMaterial() {
    var Material = ScenarioValues.Material.Value;

    var AllowedMaterials = {
        Awase: ["AutumnGrass", "Bamboo", "Butterfly", "Chrysanthemum", "CraneTurtle", "Iris", "Susuki", "GreenMapleLeaf", "MapleLeaf", "Matsu", "MatsuPlumBamboo", "Peony", "Plum", "Sakura", "Tsubaki"],
        Hitoe: ["AutumnGrass", "Bamboo", "Butterfly", "Chrysanthemum", "CraneTurtle", "Iris", "Susuki", "GreenMapleLeaf", "MapleLeaf", "Matsu", "MatsuPlumBamboo"],
        Usumono: ["AutumnGrass", "Bamboo", "Butterfly", "Chrysanthemum", "CraneTurtle", "Iris", "Susuki", "GreenMapleLeaf", "MapleLeaf", "Matsu", "MatsuPlumBamboo"]
    }

    return AllowedMaterials[Material];
}

function GetPermittedMaterials() {
    var PermittedMaterials = {
        Summer: {
            Long: ["Hitoe", "Usumono"],
            Short: ["Usumono"]
        }, 
        Spring: {
            Long: ["Awase"],
            Short: ["Awase"]
        },
        Autumn: {
            Long: ["Awase", "Hitoe"],
            Short: ["Awase", "Hitoe"]
        },
        Winter: {
            Long: ["Awase"],
            Short: ["Awase"]
        }
    }

    return PermittedMaterials;
}

function MaterialAlert(Material, Correct) {

    if (Correct) {
        if (ScenarioValues.Material.Value != "") {
            $("#MaterialModal .modal-title").text("ATARI (CORRECT)!");
            $("#material-alert").html(TextDict[Material]);

            AddClassIfNotThere("#MaterialModal .modal-header", "correct");
            $("#MaterialModal").modal("show");
        }
    } else {
        var Reasons = JSON.parse(localStorage.getItem("Reasons"));

        var ThisMaterialReasons = Reasons[Material];
        var ThisSeason = ScenarioValues.Season.Value;

        var SeasonAlert = ThisMaterialReasons.indexOf("x-season") > -1 ? "This material is not suitable for " + ThisSeason + "." : "";

        $("#material-alert").html(SeasonAlert);
        $("#MaterialModal .modal-title").text("MŌ ICHIDO (TRY AGAIN)");
        $("#MaterialModal .modal-header").removeClass("correct");
        $("#MaterialModal").modal("show");
    }

}

function PatternAlert(Pattern) {
    var Reasons = JSON.parse(localStorage.getItem("Reasons"));

    var ThisPatternReasons = Reasons[Pattern];
    var ThisSeason = ScenarioValues.Season.Value;
    var ThisMaterial = ScenarioValues.Material.Value;

    var SeasonAlert = ThisPatternReasons.indexOf("x-season") > -1 ? "This pattern is not suitable for " + ThisSeason + "." : "";

    $("#PatternModal .modal-title").text("MŌ ICHIDO (TRY AGAIN)");

    $("#pattern-alert").html(SeasonAlert);
    $("#PatternModal").modal("show");
}

function Resize(){

    if (window.innerWidth >= 800) {
        $("#Choices").hide();
    } else {
        if (!TriggeredByCollapse) {
            $("#Choices").show();
        }

    }

    if (window.innerWidth < 1000) {
        $("#MainRoom").removeClass("col-xs-8");
        $("#MainRoom").addClass("col-xs-12");
        $("#LeftGrid").hide();
    }

    if (window.innerWidth >= 1000) {
        $("#MainRoom").removeClass("col-xs-12");
        $("#MainRoom").addClass("col-xs-8");
        $("#LeftGrid").show();
    }
    
    var NewHeight = $(".main-room").height() * -1;

    $('#choice-panel').css("top", NewHeight + "px");
    $('#choice-panel').css("left", "0px");

    TriggeredByCollapse = false;

}

function ShowAlert(id) {
    $("#" + id).modal("show");
}

function HideSelectionModals() {
    $("#ObiModal").modal({ show: false});
    $("#MaterialModal").modal({ show: false});
    $("#PatternModal").modal({ show: false});
    $("#DetailModal").modal({ show: false});
}

function SetupCanvas(Page) {

    Canvas = document.getElementById("DressingRoom");
    Context = Canvas.getContext("2d");
    Canvas.width = $(".main-room").width();
    Canvas.height = $(".main-room").width() / 0.77294;

    SetClickables(Page);
    PaintImage(Page);
    Resize();
}

function SetupChoicePanels() {
    $( function() {
        $( "#choice-panel" ).draggable();
    });

    $(".choice-collapser").click(function(){
        $("#choice-modal").focus();
        TriggeredByCollapse = true;

        if ($("#caret").hasClass("fa-caret-up")) {
            $("#caret").removeClass("fa-caret-up");
            $("#caret").addClass("fa-caret-down");
        } else {
            $("#caret").removeClass("fa-caret-down");
            $("#caret").addClass("fa-caret-up");
        }
    });
}

function SetupFinalPageAlert() {
    $(".main-room").addClass(ScenarioValues.Season.Value.toLowerCase() + "-finale");
    var CongratsText = $("#CongratsHeader").text();
    
    var ExtraDetail =  KimonoType == "Iro-tomesode" ? " with 5 Family Crests" : "";
    var KimonoTypeText = KimonoType == "Iro-tomesode" ? "n " + KimonoType : " " + KimonoType; 
    $("#CongratsHeader").text(CongratsText + KimonoTypeText + " " +  ScenarioValues.Material.Value + " Kimono" + ExtraDetail);

    var TypeText = TextDict[KimonoType];
    TypeText = KimonoType == "Tsukesage" ? ScenarioValues.Material.Value == "Awase" ? TypeText.replace("%semi%", "semi&#8209;") : TypeText.replace("%semi%", "") : TypeText;

    var KimonoText = KimonoType == "Tsukesage" ? "tsuke&#8209;sage " : KimonoType + " ";
    KimonoText += ScenarioValues.Material.Value;

    $("#CongratsText").html("The " + KimonoText.toLowerCase() + " kimono is suitable " + TypeText + " during " + TextDict[ScenarioValues.Material.Value + " Congrats"]);

    $("#KimonoTypeTitle").text(KimonoType.toUpperCase());
    $("#KimonoTypeText").html(TextDict[KimonoType + " Details"]);
}

function ShowLandingAlert() {
    var ShowPageAlert = JSON.parse(localStorage.getItem("ScenarioAlerts"));

    if (ShowPageAlert["Material"] == "" && GetPage() == "Material") {
        $("#AlertModal").modal("show");
    }

    if (ShowPageAlert["Obi"] == "" && GetPage() == "Obi") {
        $("#AlertModal").modal("show");
    }

    if (ShowPageAlert["Pattern"] == "" && GetPage() == "Pattern") {
        $("#AlertModal").modal("show");
    }
}

$(document).ready(function(){
    
    var Page = GetPage();

    $('[data-toggle="popover"]').popover(); 
    
    SetupCanvas(Page);

    $(window).on("resize", function(){                      
        Resize();
    });

    SetupChoicePanels();

    if (Page == "Final") {
        SetupFinalPageAlert();
    }

    ShowLandingAlert();
    
});