var table = $('.pixel_canvas');
var originalGridWidth;
var originalGridHeight; //required for IDing grid additions,variable will be incrememnted upon addition of height
var columnLeftPlus = 1; // times used addColumnLeft+1, this ensures a negative id for each new cell
var lineDownPlus = 0;
var lineUpPlus = 1; //times used addLineUp+1, this ensures a negative id for each new cell
var columnRightPlus = 1; //" " columnRight", " " " " " " " "

$('html').bind('keypress', function(e) {
    if(e.keyCode == 13) {
        return false;
    }
}); //block enter key so no table reset by accident

function randomPixelTip() {
  $("#tip").children().first().next().remove();
  var tipNum = getRandomInt(3);
  if (tipNum === 0) {
    $("#tip").append("<span>You can save your pixel creation in PixelCode and then load it in the future that is near and far.</span>");
  } else if(tipNum === 1) {
    $("#tip").append("<span>This entire website was made possible because of an Udacity course on Web Development and Google's sponsership of it!</span>");
  } else if(tipNum === 2) {
    $("#tip").append('<span>"Back To The Future" is a must watch trilogy!</span>');
    }
  }
  function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
randomPixelTip();



$(	function toolTips() { //used code: github csasbach/tooltip.css

    $('#huh').each(function(){

      $(this).data('title',$(this).attr('title'));
      $(this).removeAttr('title');

    });

    $('#huh').mouseover(function() {

		$('#huh').next('.tooltip').remove();

		$(this).after('<span class="tooltip">' + $(this).data('title') + '</span>');

		var left = $(this).position().left + $(this).width() + 4;
		var top = $(this).position().top - 4;
		$(this).next().css('left',left);
		$(this).next().css('top',top);

    });

    $('#huh').mouseout(function(){

  $(this).next('.tooltip').remove();

})

});



$(function backToSquareOne() {
    $("#back").on("click", function() {
    $("#sizeSelect").detach().appendTo("#comeBackHere");
    $(".drawingItems").hide();
    table.children().remove();
    $(".end_result").children().remove();
    $('.creation').hide();
    $(".addToGrid").hide();
    $(".saveOrLoad").hide();
    $("#sizePicker").show();
    $(this).hide();
    randomPixelTip();
  })
})

$(function minimaxiWindowsFunctionality() {
  const minimaxi = $(".minimaxi");
  minimaxi.on("click", function(event) {
    var w = $(this).parent().next(".wrapper");
    var l = w.children(); //animation was ultimately based on a codepen by Matt Baxter (Expand/Collapse CSS Transition)
    event.preventDefault;
    if ($(this).text() === "-") {
      w.height(0);
      $(this).text("+");
    }
    else if ($(this).text() === "+") {
      w.height(l.outerHeight(true));
      $(this).text("-");

    }
    return false;
  })
})

function changeSquareSizeLive() {
  var previousSquareSize = $("#input_size").val();
  var squareSize;
  var gridWidth = $('#input_width').val();
  $(".drawable").css("width", previousSquareSize);
  $(".drawable").css("height", previousSquareSize);

    $("#input_size").on('change', function newSize() {
        squareSize = $(this).val();

        if (gridWidth*squareSize<=528) {
        previousSquareSize = squareSize;
        $(".drawable").css("width", squareSize);
        $(".drawable").css("height", squareSize);
      }
      else {
        $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Pixel canvas cannot exceed 528px width!</p>');
        $('.errorMessage').delay(1000).fadeOut(650);
        setTimeout(function()
        {
          $('input').removeClass("redAndWrong");
        }, 1200);
        $(this).val(previousSquareSize);
      }
    })
} // run when called by changes

$(changeSquareSizeLive()); // run when document ready

function borderChangeFunctionality() {

    var borderChecked = $("#borderCheckbox").prop("checked");
    if(borderChecked) {
        $(".drawable").css("border-width", "1px");
        $('#borderSelect').show()
    } else {
        $(".drawable").css("border-width", "0px")
        $('#borderSelect').hide()
    }
    $('#borderCheckbox').change(function () {
        borderChecked = $(this).prop("checked");
        if(borderChecked) {
            $(".drawable").css("border-width", "1px");
            $('#borderSelect').show()
        } else {
            $(".drawable").css("border-width", "0px");
            $('#borderSelect').hide()
        }; //show or hide border according to checkbox

    });


    var borderColor = $("#borderColor").val();
    $('#borderColor').change(function() {
        borderColor = $(this).val();
        $(".drawable").css("border-color", borderColor);
    });
    $(".drawable").css("border-color", borderColor);
        //listen to change in border color picker
};

$(function gridMakingFunctionality() {

    function makeGrid(gridHeight, gridWidth, squareSize) {

        table.children().remove(); // Reset table
        for(var h = 1; h <= gridHeight; h++) {
            table.append('<tr class="row" id="row%' + h + '"></tr>'); // Add lines
            for(var w = 1; w <= gridWidth; w++) {
                table.children().last().append('<td id="' + h +"_"+w +'" class="drawable"></td>'); // Add columns
            }
        }
        $(".drawable").css("width", squareSize);
        $(".drawable").css("height", squareSize);
        displayEndResult(table);

        borderChangeFunctionality(); //set border of grid
        $(".drawingItems").show();
        $('.creation').show();
        $(".addToGrid").show();
        $(".saveOrLoad").show();
        lineUpPlus=1;
        columnLeftPlus=1;
        columnRightPlus=1;
        lineDownPlus=1;
        $("#sizePicker").hide();
        $("#sizeSelect").detach().appendTo("#sizeSelectLive");
        $("#back").show();
        $("#loadBox").children().remove();
        originalGridHeight = gridHeight;
        originalGridWidth = gridWidth;

        undoArray=[];
        undoType = $('input[name=undoType]:checked').val(); //get which undo functionality to use
        savePointIndex=0;
        undoArray.push(createSavePoint()); //creates first save point

        toolIcons.paintBucketIcon._2load(toolIcons.paintBucketIcon._pixelCode);
        toolIcons.penIcon._2load(toolIcons.penIcon._pixelCode);
        randomPixelTip();
    };

    const sizePickerForm = document.querySelector("#sizePicker");
    sizePickerForm.addEventListener("submit", function(e) {
        e.preventDefault();
        var gridHeight = $('#input_height').val();
        var gridWidth = $('#input_width').val();
        var squareSize = $('#input_size').val();
        if (gridWidth*squareSize<=528) {
          makeGrid(gridHeight, gridWidth, squareSize)
        }
        else {
          $('.errorMessage').remove()
          $("#input_size").addClass("redAndWrong");
          $("#input_width").addClass("redAndWrong");
          $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span>  Pixel canvas cannot exceed 528px width!</p>');
          $('.errorMessage').delay(1000).fadeOut(650);
          setTimeout(function()
          {
            $('input').removeClass("redAndWrong");
          }, 1200);

        }
    }); //Make Grid! button listener
    function loadCode(pixelCode) {
      makeGrid(pixelCode[0], pixelCode[1], pixelCode[2]);
      $("#input_size").val(pixelCode[2]);
      for (var s = 3; s<=pixelCode.length-1; s++) {
        if (s%2 !== 0) {
          var indexS = pixelCode[s]-1;
        }
        else if (s%2 === 0) {
          var cellColor = "#" + pixelCode[s];
          table.children().children().eq(indexS).css("background-color", cellColor);
        }
      }
      displayEndResult(table);
      saveSavePoint();
    }
    const loadCodeButton = $('#loadCodeButton');
    loadCodeButton.on("click", function(event) {
      event.preventDefault();
      $("#loadBox").children().remove();
      $("#loadBox").append('<br><div class="flexalign"><div><textarea rows="8" cols="40" placeholder="Paste PixelCode here!"></textarea></div><div> &nbsp; <button id="loadButton" class="biggerBlackButton">Load <br> Creation!</button></div></div>');
    })
    $("#loadBox").on("click", "#loadButton", function(event) {
      event.preventDefault();
      var pixelCode=$("textarea").val().split(", ");
      loadCode(pixelCode);
    })
    const loadEmptySmiley = $("#empty_smiley");
    loadEmptySmiley.on("click", function(event) {
      event.preventDefault();
      var pixelCode= [15,15,20,1,"ffffff",2,"ffffff",3,"ffffff",4,"ffffff",5,"ffffff",6,"000000",7,"000000",8,"000000",9,"000000",10,"000000",11,"ffffff",12,"ffffff",13,"ffffff",14,"ffffff",15,"ffffff",16,"ffffff",17,"ffffff",18,"ffffff",19,"000000",20,"000000",21,"ffffff",22,"ffffff",23,"ffffff",24,"ffffff",25,"ffffff",26,"000000",27,"000000",28,"ffffff",29,"ffffff",30,"ffffff",31,"ffffff",32,"ffffff",33,"000000",34,"ffffff",35,"ffffff",36,"ffffff",37,"ffffff",38,"ffffff",39,"ffffff",40,"ffffff",41,"ffffff",42,"ffffff",43,"000000",44,"ffffff",45,"ffffff",46,"ffffff",47,"000000",48,"ffffff",49,"ffffff",50,"ffffff",51,"ffffff",52,"ffffff",53,"ffffff",54,"ffffff",55,"ffffff",56,"ffffff",57,"ffffff",58,"ffffff",59,"000000",60,"ffffff",61,"ffffff",62,"000000",63,"ffffff",64,"ffffff",65,"ffffff",66,"ffffff",67,"ffffff",68,"ffffff",69,"ffffff",70,"ffffff",71,"ffffff",72,"ffffff",73,"ffffff",74,"000000",75,"ffffff",76,"000000",77,"ffffff",78,"ffffff",79,"ffffff",80,"ffffff",81,"ffffff",82,"ffffff",83,"ffffff",84,"ffffff",85,"ffffff",86,"ffffff",87,"ffffff",88,"ffffff",89,"ffffff",90,"000000",91,"000000",92,"ffffff",93,"ffffff",94,"ffffff",95,"ffffff",96,"ffffff",97,"ffffff",98,"ffffff",99,"ffffff",100,"ffffff",101,"ffffff",102,"ffffff",103,"ffffff",104,"ffffff",105,"000000",106,"000000",107,"ffffff",108,"ffffff",109,"ffffff",110,"ffffff",111,"ffffff",112,"ffffff",113,"ffffff",114,"ffffff",115,"ffffff",116,"ffffff",117,"ffffff",118,"ffffff",119,"ffffff",120,"000000",121,"000000",122,"ffffff",123,"ffffff",124,"ffffff",125,"ffffff",126,"ffffff",127,"ffffff",128,"ffffff",129,"ffffff",130,"ffffff",131,"ffffff",132,"ffffff",133,"ffffff",134,"ffffff",135,"000000",136,"000000",137,"ffffff",138,"ffffff",139,"ffffff",140,"ffffff",141,"ffffff",142,"ffffff",143,"ffffff",144,"ffffff",145,"ffffff",146,"ffffff",147,"ffffff",148,"ffffff",149,"ffffff",150,"000000",151,"ffffff",152,"000000",153,"ffffff",154,"ffffff",155,"ffffff",156,"ffffff",157,"ffffff",158,"ffffff",159,"ffffff",160,"ffffff",161,"ffffff",162,"ffffff",163,"ffffff",164,"000000",165,"ffffff",166,"ffffff",167,"000000",168,"ffffff",169,"ffffff",170,"ffffff",171,"ffffff",172,"ffffff",173,"ffffff",174,"ffffff",175,"ffffff",176,"ffffff",177,"ffffff",178,"ffffff",179,"000000",180,"ffffff",181,"ffffff",182,"ffffff",183,"000000",184,"ffffff",185,"ffffff",186,"ffffff",187,"ffffff",188,"ffffff",189,"ffffff",190,"ffffff",191,"ffffff",192,"ffffff",193,"000000",194,"ffffff",195,"ffffff",196,"ffffff",197,"ffffff",198,"ffffff",199,"000000",200,"000000",201,"ffffff",202,"ffffff",203,"ffffff",204,"ffffff",205,"ffffff",206,"000000",207,"000000",208,"ffffff",209,"ffffff",210,"ffffff",211,"ffffff",212,"ffffff",213,"ffffff",214,"ffffff",215,"ffffff",216,"000000",217,"000000",218,"000000",219,"000000",220,"000000",221,"ffffff",222,"ffffff",223,"ffffff",224,"ffffff",225,"ffffff"];
      loadCode(pixelCode);
    })

}); //end brackets of gridMakingFunctionality

var undoArray = [];
var undoType;
var savePointIndex = 0;

    function createSavePoint() {
      var gridWidthString = table.children().first().children().length;
      var gridWidth = parseInt(gridWidthString);
      var gridHeight = table.children().length;
      $("#containerSaveBox").hide();
      var pixelCode = [gridHeight, gridWidth];
      var pixelCodeCells = 1;
      //Function to convert hex format to a rgb color, credits to Mottie of JSFiddle
      function rgb2hex(rgb) {
          rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
          return (rgb && rgb.length === 4) ? "#" + //insert # for proper hex, remove for cleaner pixelCode
              ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
              ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
      }
      table.children().children().each(function() {
          pixelCode.push(pixelCodeCells);
          pixelCode.push(rgb2hex($(this).css("background-color")))
          pixelCodeCells++
        });

        return pixelCode;
      }

      function saveSavePoint() {
        if (undoArray.length-1===savePointIndex) {
          savePointIndex++
          undoArray[savePointIndex]=createSavePoint();

          }
        else if (undoArray.length-1!==savePointIndex && undoType==="oldUndo"){

          undoArray[savePointIndex+1]=createSavePoint();
          for (var x=undoArray.length-1; x>=savePointIndex+2; x--) {
            undoArray.pop(x)
          }
          savePointIndex++;
        }
        else if (undoArray.length-1!==savePointIndex && undoType==="smartUndo") {
          var mirrorIndex = undoArray.length;
          for (var y=undoArray.length-2; y>=savePointIndex-1; y--) {
            undoArray[mirrorIndex]=(undoArray[y]);
            mirrorIndex++;
          }
          savePointIndex=undoArray.length-1;
          undoArray[savePointIndex]=createSavePoint();
        }
        //  console.log('length -1 : ' + (undoArray.length-1) + ' index:' + savePointIndex)
      }

      function undo() {
        $("#containerSaveBox").hide();

        if (savePointIndex == 0) {}
        else {savePointIndex--}

        //  console.log('length -1 : ' + (undoArray.length-1) + ' index:' + savePointIndex);

        var latestVersion = undoArray.slice(savePointIndex)[0];

        columnLeftPlus = 1;
        columnRightPlus = 1;
        lineUpPlus = 1;
        lineDownPlus= 1;

        function makeGrid(gridHeight, gridWidth) {

            table.children().remove();
            for(var h = 1; h <= gridHeight; h++) {
                table.append('<tr class="row" id="row%' + h + '"></tr>');
                for(var w = 1; w <= gridWidth; w++) {
                    table.children().last().append('<td id="' + h +"_"+w +'" class="drawable"></td>');
                }
            }
            originalGridHeight = gridHeight;
            originalGridWidth = gridWidth;

        }

        makeGrid(latestVersion[0], latestVersion[1]);

         for (var s = 2; s<=latestVersion.length-1; s++) {
           if (s%2 === 0) {
             var indexS = latestVersion[s]-1;
           }
           else if (s%2 !== 0) {
             var cellColor = latestVersion[s];
             table.children().children().eq(indexS).css("background-color", cellColor);
           }
         }
         changeSquareSizeLive();
         displayEndResult(table);
      }

      function redo() {
        $("#containerSaveBox").hide();

        if (savePointIndex == undoArray.length-1) {}
        else {savePointIndex++}
        //  console.log(undoArray.length-1, savePointIndex);

        var latestVersion = undoArray.slice(savePointIndex)[0];

        columnLeftPlus = 1;
        columnRightPlus = 1;
        lineUpPlus = 1;
        lineDownPlus= 1;

        function makeGrid(gridHeight, gridWidth) {

            table.children().remove();
            for(var h = 1; h <= gridHeight; h++) {
                table.append('<tr class="row" id="row%' + h + '"></tr>');
                for(var w = 1; w <= gridWidth; w++) {
                    table.children().last().append('<td id="' + h +"_"+w +'" class="drawable"></td>');
                }
            }
            originalGridHeight = gridHeight;
            originalGridWidth = gridWidth;

        }

        makeGrid(latestVersion[0], latestVersion[1]);

         for (var s = 2; s<=latestVersion.length-1; s++) {
           if (s%2 === 0) {
             var indexS = latestVersion[s]-1;
           }
           else if (s%2 !== 0) {
             var cellColor = latestVersion[s];
             table.children().children().eq(indexS).css("background-color", cellColor);
           }
         }
         changeSquareSizeLive();
         displayEndResult(table);

      }
$(function keyFunctionality() {
      $(document).keydown(function(e) { // ctrl+z/+z+shift listener
        if (e.which === 90 && e.ctrlKey && !e.shiftKey ){
         e.preventDefault(); // so browser doesn't change value for square size
         undo();
       }
       else if (e.which === 90 && e.ctrlKey && e.shiftKey ){
         e.preventDefault(); // so browser doesn't change value for square size
         redo();
       }
       else {}
       });

     $(document).keydown(function(e) {
       if (e.ctrlKey) {
         ctrlDown = true;
     }})

     $(document).keyup(function(e) {
       if (e.keyCode==17) {
         ctrlDown = false;
     }})

});

var ctrlDown = false;
var color = "#00ced1"; //drawing color
var eraseColor = "#ffffff"; //erasing color
$('.color1').css('background-color', '#000000');

var toolIcons = {
  paintBucketIcon: {
    _place: $("#paintBucketIcon"),
    _pixelCode:   [15, 15, 20, 1, "#ffffff", 2, "#ffffff", 3, "#ffffff", 4, "#ffffff", 5, "black", 6, "black", 7, "black", 8, "#ffffff", 9, "#ffffff", 10, "#ffffff", 11, "#ffffff", 12, "#ffffff", 13, "#ffffff", 14, "#ffffff", 15, "#ffffff", 16, "#ffffff", 17, "#ffffff", 18, "#ffffff", 19, "black", 20, "#ffffff", 21, "#ffffff", 22, "#ffffff", 23, "black", 24, "#ffffff", 25, "#ffffff", 26, "#ffffff", 27, "#ffffff", 28, "#ffffff", 29, "#ffffff", 30, "#ffffff", 31, "#ffffff", 32, "#ffffff", 33, "#ffffff", 34, "black", 35, "#ffffff", 36, "#ffffff", 37, "black", 38, "black", 39, "#ffffff", 40, "#ffffff", 41, "#ffffff", 42, "#ffffff", 43, "#ffffff", 44, "#ffffff", 45, "#ffffff", 46, "#ffffff", 47, "#ffffff", 48, "#ffffff", 49, "black", 50, "#ffffff", 51, "black", 52, "#D3D3D3", 53, "black", 54, "black", 55, "#ffffff", 56, "#ffffff", 57, "#ffffff", 58, "#ffffff", 59, "#ffffff", 60, "#ffffff", 61, "#ffffff", 62, "#ffffff", 63, "#ffffff", 64, "black", 65, "black", 66, "#D3D3D3", 67, "#D3D3D3", 68, "black", 69, "white", 70, color, 71, color, 72, "#ffffff", 73, "#ffffff", 74, "#ffffff", 75, "#ffffff", 76, "#ffffff", 77, "#ffffff", 78, "#ffffff", 79, "black", 80, "#D3D3D3", 81, "#D3D3D3", 82, "#D3D3D3", 83, "black", 84, "white", 85, "white", 86, "black", 87, color, 88, color, 89, "#ffffff", 90, "#ffffff", 91, "#ffffff", 92, "#ffffff", 93, "black", 94, "#D3D3D3", 95, "#D3D3D3", 96, "white", 97, "black", 98, "white", 99, "black", 100, "white", 101, "white", 102, "black", 103, color, 104, color, 105, color, 106, "#ffffff", 107, "black", 108, "#D3D3D3", 109, "#D3D3D3", 110, "#D3D3D3", 111, "white", 112, "white", 113, "black", 114, "white", 115, "white", 116, "white", 117, "white", 118, color, 119, color, 120, color, 121, "black", 122, "#D3D3D3", 123, "#D3D3D3", 124, "#D3D3D3", 125, "white", 126, "white", 127, "white", 128, "white", 129, "white", 130, "white", 131, "white", 132, "black", 133, color, 134, color, 135, color, 136, "black", 137, "#D3D3D3", 138, "#D3D3D3", 139, "white", 140, "white", 141, "white", 142, "white", 143, "white", 144, "white", 145, "#808080", 146, "black", 147, "#ffffff", 148, color, 149, color, 150, color, 151, "black", 152, "white", 153, "white", 154, "white", 155, "white", 156, "white", 157, "white", 158, "#808080", 159, "#808080", 160, "black", 161, "#ffffff", 162, "#ffffff", 163, color, 164, color, 165, color, 166, "#ffffff", 167, "black", 168, "white", 169, "white", 170, "white", 171, "white", 172, "#808080", 173, "#808080", 174, "black", 175, "#ffffff", 176, "#ffffff", 177, "#ffffff", 178, color, 179, color, 180, color, 181, "#ffffff", 182, "#ffffff", 183, "black", 184, "white", 185, "white", 186, "#808080", 187, "#808080", 188, "black", 189, "#ffffff", 190, "#ffffff", 191, "#ffffff", 192, "#ffffff", 193, color, 194, color, 195, "#ffffff", 196, "#ffffff", 197, "#ffffff", 198, "#ffffff", 199, "black", 200, "white", 201, "#808080", 202, "black", 203, "#ffffff", 204, "#ffffff", 205, "#ffffff", 206, "#ffffff", 207, "#ffffff", 208, color, 209, "#ffffff", 210, "#ffffff", 211, "#ffffff", 212, "#ffffff", 213, "#ffffff", 214, "#ffffff", 215, "black", 216, "black", 217, "#ffffff", 218, "#ffffff", 219, "#ffffff", 220, "#ffffff", 221, "#ffffff", 222, "#ffffff", 223, color, 224, "#ffffff", 225, "#ffffff"],
    _2load: function(pixelCode) {
      this._place.children().remove();
      for (var h=1; h<=pixelCode[0]; h++) {
        this._place.append("<tr></tr>");
        for (var w=1; w<=pixelCode[1]; w++) {
          this._place.children().last().append("<td></td>");
      }
      }

      for (var s = 3; s<=pixelCode.length-1; s++) {
        if (s%2 !== 0) {
          var indexS = pixelCode[s]-1;
        }
        else if (s%2 === 0) {
          var cellColor = pixelCode[s];
          this._place.children().children().eq(indexS).css("background-color", cellColor);
        }
      }

    }
  },
  penIcon: {
    _place: $("#penIcon"),
    _pixelCode:[18, 18, 20, 1, "#ffffff", 2, "#ffffff", 3, "#ffffff", 4, "#ffffff", 5, "#ffffff", 6, "#ffffff", 7, "#ffffff", 8, "#ffffff", 9, "#ffffff", 10, "#ffffff", 11, "#ffffff", 12, "#ffffff", 13, "#ffffff", 14, "#ffffff", 15, "#ffffff", 16, "#ffffff", 17, "#ffffff", 18, "black", 19, "#ffffff", 20, "#ffffff", 21, "#ffffff", 22, "#ffffff", 23, "#ffffff", 24, "#ffffff", 25, "#ffffff", 26, "#ffffff", 27, "#ffffff", 28, "#ffffff", 29, "#ffffff", 30, "#ffffff", 31, "#ffffff", 32, "#ffffff", 33, "#ffffff", 34, "#ffffff", 35, "black", 36, "#ffffff", 37, "#ffffff", 38, "#ffffff", 39, "#ffffff", 40, "#ffffff", 41, "#ffffff", 42, "#ffffff", 43, "#ffffff", 44, "#ffffff", 45, "#ffffff", 46, "#ffffff", 47, "#ffffff", 48, "#ffffff", 49, "#ffffff", 50, "#ffffff", 51, "#ffffff", 52, "black", 53, "#ffffff", 54, "#ffffff", 55, "#ffffff", 56, "#ffffff", 57, "#ffffff", 58, "#ffffff", 59, "#ffffff", 60, "#ffffff", 61, "#ffffff", 62, "#ffffff", 63, "#ffffff", 64, "#ffffff", 65, "#ffffff", 66, "#ffffff", 67, "#ffffff", 68, "#ffffff", 69, "black", 70, "#ffffff", 71, "#ffffff", 72, "#ffffff", 73, "#ffffff", 74, "#ffffff", 75, "#ffffff", 76, "#ffffff", 77, "#ffffff", 78, "#ffffff", 79, "#ffffff", 80, "#ffffff", 81, "#ffffff", 82, "#ffffff", 83, "#ffffff", 84, "#ffffff", 85, "#ffffff", 86, "black", 87, "black", 88, "#ffffff", 89, "#ffffff", 90, "#ffffff", 91, "#ffffff", 92, "#ffffff", 93, "#ffffff", 94, "#ffffff", 95, "#ffffff", 96, "#ffffff", 97, "#ffffff", 98, "#ffffff", 99, "#ffffff", 100, "#ffffff", 101, "#ffffff", 102, "#ffffff", 103, "black", 104, "black", 105, "#ffffff", 106, "#ffffff", 107, "#ffffff", 108, "#ffffff", 109, "#ffffff", 110, "#ffffff", 111, "#ffffff", 112, "#ffffff", 113, "#ffffff", 114, "#ffffff", 115, "#ffffff", 116, "#ffffff", 117, "#ffffff", 118, "#ffffff", 119, "black", 120, "black", 121, "black", 122, "black", 123, "#ffffff", 124, "#ffffff", 125, "#ffffff", 126, "#ffffff", 127, "#ffffff", 128, "#ffffff", 129, "#ffffff", 130, "#ffffff", 131, "#ffffff", 132, "#ffffff", 133, "#ffffff", 134, "#ffffff", 135, "#ffffff", 136, "black", 137, eraseColor, 138, eraseColor, 139, "black", 140, "#ffffff", 141, "#ffffff", 142, "#ffffff", 143, "#ffffff", 144, "#ffffff", 145, "#ffffff", 146, "#ffffff", 147, "#ffffff", 148, "#ffffff", 149, "#ffffff", 150, "#ffffff", 151, "#ffffff", 152, "#ffffff", 153, "black", 154, "black", 155, eraseColor, 156, eraseColor, 157, "black", 158, "#ffffff", 159, "#ffffff", 160, "#ffffff", 161, "#ffffff", 162, "#ffffff", 163, "#ffffff", 164, "#ffffff", 165, "#ffffff", 166, "#ffffff", 167, "#ffffff", 168, "#ffffff", 169, "#ffffff", 170, "black", 171, "black", 172, "black", 173, "black", 174, "black", 175, "#ffffff", 176, "#ffffff", 177, "#ffffff", 178, "#ffffff", 179, "#ffffff", 180, "#ffffff", 181, "#ffffff", 182, "#ffffff", 183, "#ffffff", 184, "#ffffff", 185, "#ffffff", 186, "#ffffff", 187, "black", 188, "black", 189, "black", 190, "#ffffff", 191, "#ffffff", 192, "#ffffff", 193, "#ffffff", 194, "#ffffff", 195, "#ffffff", 196, "#ffffff", 197, "#ffffff", 198, "#ffffff", 199, "#ffffff", 200, "#ffffff", 201, "#ffffff", 202, "#ffffff", 203, "black", 204, "black", 205, "black", 206, "black", 207, "black", 208, "#ffffff", 209, "#ffffff", 210, "#ffffff", 211, "#ffffff", 212, "#ffffff", 213, "#ffffff", 214, "#ffffff", 215, "#ffffff", 216, "#ffffff", 217, "#ffffff", 218, "#ffffff", 219, "black", 220, "black", 221, "black", 222, "black", 223, "black", 224, "black", 225, "#ffffff", 226, "#ffffff", 227, "#ffffff", 228, "#ffffff", 229, "#ffffff", 230, "#ffffff", 231, "#ffffff", 232, "#ffffff", 233, "#ffffff", 234, "#ffffff", 235, "#ffffff", 236, "black", 237, "black", 238, "black", 239, "black", 240, "black", 241, "black", 242, "black", 243, "#ffffff", 244, "#ffffff", 245, "#ffffff", 246, "#ffffff", 247, "#ffffff", 248, "#ffffff", 249, "#ffffff", 250, "#ffffff", 251, "#ffffff", 252, "#ffffff", 253, color, 254, "black", 255, "black", 256, "black", 257, "black", 258, "black", 259, "#ffffff", 260, "#ffffff", 261, "#ffffff", 262, "#ffffff", 263, "#ffffff", 264, "#ffffff", 265, "#ffffff", 266, "#ffffff", 267, "#ffffff", 268, "#ffffff", 269, "#ffffff", 270, "#ffffff", 271, color, 272, color, 273, "black", 274, "black", 275, "black", 276, "black", 277, "#ffffff", 278, "#ffffff", 279, "#ffffff", 280, "#ffffff", 281, "#ffffff", 282, "#ffffff", 283, "#ffffff", 284, "#ffffff", 285, "#ffffff", 286, "#ffffff", 287, "#ffffff", 288, "#ffffff", 289, color, 290, color, 291, color, 292, "black", 293, "#ffffff", 294, "#ffffff", 295, "#ffffff", 296, "#ffffff", 297, "#ffffff", 298, "#ffffff", 299, "#ffffff", 300, "#ffffff", 301, "#ffffff", 302, "#ffffff", 303, "#ffffff", 304, "#ffffff", 305, "#ffffff", 306, "#ffffff", 307, color, 308, color, 309, color, 310, color, 311, "#ffffff", 312, "#ffffff", 313, "#ffffff", 314, "#ffffff", 315, "#ffffff", 316, "#ffffff", 317, "#ffffff", 318, "#ffffff", 319, "#ffffff", 320, "#ffffff", 321, "#ffffff", 322, "#ffffff", 323, "#ffffff", 324, "#ffffff"],
  _2load: function(pixelCode) {

      this._place.children().remove();
      for (var h=1; h<=pixelCode[0]; h++) {
        this._place.append("<tr></tr>");
        for (var w=1; w<=pixelCode[1]; w++) {
          this._place.children().last().append("<td></td>");
      }
      }

      for (var s = 3; s<=pixelCode.length-1; s++) {
        if (s%2 !== 0) {
          var indexS = pixelCode[s]-1;
        }
        else if (s%2 === 0) {
          var cellColor = pixelCode[s];
          this._place.children().children().eq(indexS).css("background-color", cellColor);
        }
      }

  }
  }
}

function displayEndResult(table) {
    var endResult = $(".end_result");
    endResult.children().remove(); // Reset endResult table
    table.clone().appendTo(endResult);
    endResult.children().removeAttr("class");
    endResult.children().attr("style", "border-collapse: collapse");
    var endCells = endResult.find(".drawable");
    var endRows = endResult.children().children();
    endCells.css("height", "");
    endCells.css("width", "");
    endCells.css("border-width", "");
    endCells.removeAttr("class");
    endCells.removeAttr("id");
    endRows.removeAttr("id");
    endRows.removeAttr("class");
} // display minimzed version of canvas

$(function addToGridFunctionality() {
      const lineDown = $("#lineDown");
      const lineUp = $("#lineUp");
      const columnLeft = $("#columnLeft");
      const columnRight = $("#columnRight");
      const removeLineDownJS = $("#removeLineDown");
      const removeLineUpJS = $("#removeLineUp");
      const removeColumnLeftJS = $("#removeColumnLeft");
      const removeColumnRightJS = $("#removeColumnRight");
      removeLineDownJS.on("click", function(event) {removeLineDown();});
      removeLineUpJS.on("click", function(event) {removeLineUp();});
      removeColumnLeftJS.on("click", function(event) {removeColumnLeft();});
      removeColumnRightJS.on("click", function(event) {removeColumnRight();});
      function removeLineDown() {
        if (table.children().children().length===1 || table.children().length===1) {
          $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Cannot clear canvas');
          $('.errorMessage').delay(1000).fadeOut(650);
        } else {
        table.children().last().remove();
          lineDownPlus--;
          borderChangeFunctionality();
          changeSquareSizeLive();
          displayEndResult(table);
        }
        saveSavePoint();
      }
      function removeLineUp() {
        if (table.children().children().length===1 || table.children().length===1) {
          $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Cannot clear canvas!');
          $('.errorMessage').delay(1000).fadeOut(650);
        } else {
        table.children().first().remove();
        lineUpPlus--;
        borderChangeFunctionality();
        changeSquareSizeLive();
        displayEndResult(table);
        }
        saveSavePoint();
      }
      function removeColumnRight() {
        if (table.children().children().length===1) {
          $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Cannot clear canvas!');
          $('.errorMessage').delay(1000).fadeOut(650);
        } else {
        table.children().each(function() {$(this).children().last().remove()});
        columnRightPlus--;
        borderChangeFunctionality();
        changeSquareSizeLive();
        displayEndResult(table);
        }
        saveSavePoint();
      }
      function removeColumnLeft() {
        if (table.children().children().length===1) {
          $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Cannot clear canvas!');
          $('.errorMessage').delay(1000).fadeOut(650);
        } else {
        table.children().each(function() {$(this).children().first().remove()});
        columnLeftPlus--;
        borderChangeFunctionality();
        changeSquareSizeLive();
        displayEndResult(table);
        }
        saveSavePoint();
      }
      function addLineDown() {
        var gridWidthString = table.children().first().children().last().attr("id").toString().split('_').pop();
        // gets last number of ID of last cell in first line
        var gridWidth = parseInt(gridWidthString);
        var gridWidthBeginID =table.children().first().children().first().attr("id").toString().split('_').pop();
        // gets last number of ID of first cell in first line
        table.append('<tr class="row" id="row%' + (parseFloat(originalGridHeight) + parseFloat(lineDownPlus)) + '"></tr>');
        for (var w=gridWidthBeginID; w<=gridWidth; w++) {
          table.children().last().append('<td id="' + (parseFloat(originalGridHeight) + parseFloat(lineDownPlus)) +"_"+w +'" class="drawable"></td>');
        }

        lineDownPlus++;
        borderChangeFunctionality();
        changeSquareSizeLive();
        saveSavePoint();
        displayEndResult(table);
      }
      function addLineUp() {
        var gridWidthString = table.children().first().children().last().attr("id").toString().split('_').pop();
        // gets last number of ID of last cell in first line
        var gridWidth = parseInt(gridWidthString);
        var gridWidthBeginID = table.children().first().children().first().attr("id").toString().split('_').pop();
        // gets last number of ID of first cell in first line
        table.prepend('<tr class="row" id="row%' + (1-lineUpPlus) + '"></tr>');
        for (var w=gridWidthBeginID; w<=gridWidth; w++) {
          table.children().first().append('<td id="' + (1-lineUpPlus) +"_"+w +'" class="drawable"></td>');
        }
        lineUpPlus++;
        borderChangeFunctionality();
        changeSquareSizeLive();
        saveSavePoint();
        displayEndResult(table);
      }
      function addColumnLeft() {
        table.children().each(function() {
          $(this).prepend('<td id="' + $(this).attr('id').toString().split('%').pop() +"_"+(1-columnLeftPlus) +'"class="drawable"></td>')
        })
        columnLeftPlus++;
        borderChangeFunctionality();
        changeSquareSizeLive();
        saveSavePoint();
        displayEndResult(table);
      }
      function addColumnRight() {
        table.children().each(function() {
          $(this).append('<td id="' + $(this).attr('id').toString().split('%').pop() +"_"+(parseFloat(originalGridWidth) + parseFloat(columnRightPlus)) +'"class="drawable"></td>')
      })
      columnRightPlus++;
      borderChangeFunctionality();
      changeSquareSizeLive();
      saveSavePoint();
      displayEndResult(table);
    }


    lineDown.on("click", function(event) {
      addLineDown();
    })
    lineUp.on("click", function(event) {
      addLineUp();
    })
    columnLeft.on("click", function(event) {
      var canvasWidth = table.children().first().children().length;
      var cellSize = squareSize = $("#input_size").val();

      if (cellSize*(canvasWidth+1)<=528) {
        addColumnLeft();
      }

      else {
        $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Pixel canvas cannot exceed 528px width!</p>');
        $('.errorMessage').delay(1000).fadeOut(650);
      }

    })
    columnRight.on("click", function(event) {
      var canvasWidth = table.children().first().children().length;
      var cellSize = squareSize = $("#input_size").val();

      if (cellSize*(canvasWidth+1)<=528) {
        addColumnRight();
      }

      else {
        $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Pixel canvas cannot exceed 528px width!</p>');
        $('.errorMessage').delay(1000).fadeOut(650);
      }
    })
    const plusButton = $("#plus");
    const minusButton = $("#minus");
    const addButtons = $("#addButtons");
    const removeButtons = $("#removeButtons");

    plusButton.on("click", function(event) {
      addButtons.hide();
      removeButtons.show();
    })
    minusButton.on("click", function(event) {
      removeButtons.hide();
      addButtons.show();
    })

});

$(function drawingFunctionality() {
    var isDrawing = false; //drawing
    var rightMouseButton = false; //erasing
    var isFilling = false; //fill parts of grid with color
    //False values means no interaction with grid

    const drawButton = $("#penIcon");
    const fillButton = $("#paintBucketIcon");

    var tool = 1; //pen is 1

    function styleButtons() {if (tool === 1 && !rightMouseButton) {
      drawButton.css("border-bottom", `4px solid ${color}`);
      fillButton.css("border-bottom", "")
    } else if (tool === 2 && !rightMouseButton) {fillButton.css("border-bottom", `9px solid ${color}`);
      drawButton.css("border-bottom", "")}
      else if (tool === 1 && rightMouseButton) {drawButton.css("border-bottom", `4px solid ${eraseColor}`);
      fillButton.css("border-bottom", "")}
      else if (tool === 2 && rightMouseButton) {fillButton.css("border-bottom", `9px solid ${eraseColor}`);
        drawButton.css("border-bottom", "")}}

      styleButtons();

    drawButton.on("click", function(event) {
      tool=1;
      styleButtons();
    });
    fillButton.on("click", function(event) {
      if (ctrlDown) {
        $(".drawable").css("background-color", color);
        displayEndResult(table);
        saveSavePoint();
        tool=2;

      } else {
      tool=2; //bucket is 2
      styleButtons();
    }
    })

    //Function to convert hex format to a rgb color, credits to Mottie of JSFiddle
    function rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" + //insert # for proper hex, remove for cleaner pixelCode
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }

    var paletteColor;
    var customColor;

    $('#colorPicker').on("change", function() {
        customColor = $(this).val();
        color = customColor;
        styleButtons();
        changeIconStyles();
    }); //listen to change in color picker and remember if different color picked


    $('#colorPicker').on("mousedown", function() {
            customColor = $(this).val();
            color = customColor;
            styleButtons();
            changeIconStyles();
        });

    function changeIconStyles() {
      toolIcons.paintBucketIcon._pixelCode = [15, 15, 20, 1, "#ffffff", 2, "#ffffff", 3, "#ffffff", 4, "#ffffff", 5, "black", 6, "black", 7, "black", 8, "#ffffff", 9, "#ffffff", 10, "#ffffff", 11, "#ffffff", 12, "#ffffff", 13, "#ffffff", 14, "#ffffff", 15, "#ffffff", 16, "#ffffff", 17, "#ffffff", 18, "#ffffff", 19, "black", 20, "#ffffff", 21, "#ffffff", 22, "#ffffff", 23, "black", 24, "#ffffff", 25, "#ffffff", 26, "#ffffff", 27, "#ffffff", 28, "#ffffff", 29, "#ffffff", 30, "#ffffff", 31, "#ffffff", 32, "#ffffff", 33, "#ffffff", 34, "black", 35, "#ffffff", 36, "#ffffff", 37, "black", 38, "black", 39, "#ffffff", 40, "#ffffff", 41, "#ffffff", 42, "#ffffff", 43, "#ffffff", 44, "#ffffff", 45, "#ffffff", 46, "#ffffff", 47, "#ffffff", 48, "#ffffff", 49, "black", 50, "#ffffff", 51, "black", 52, "#D3D3D3", 53, "black", 54, "black", 55, "#ffffff", 56, "#ffffff", 57, "#ffffff", 58, "#ffffff", 59, "#ffffff", 60, "#ffffff", 61, "#ffffff", 62, "#ffffff", 63, "#ffffff", 64, "black", 65, "black", 66, "#D3D3D3", 67, "#D3D3D3", 68, "black", 69, "white", 70, color, 71, color, 72, "#ffffff", 73, "#ffffff", 74, "#ffffff", 75, "#ffffff", 76, "#ffffff", 77, "#ffffff", 78, "#ffffff", 79, "black", 80, "#D3D3D3", 81, "#D3D3D3", 82, "#D3D3D3", 83, "black", 84, "white", 85, "white", 86, "black", 87, color, 88, color, 89, "#ffffff", 90, "#ffffff", 91, "#ffffff", 92, "#ffffff", 93, "black", 94, "#D3D3D3", 95, "#D3D3D3", 96, "white", 97, "black", 98, "white", 99, "black", 100, "white", 101, "white", 102, "black", 103, color, 104, color, 105, color, 106, "#ffffff", 107, "black", 108, "#D3D3D3", 109, "#D3D3D3", 110, "#D3D3D3", 111, "white", 112, "white", 113, "black", 114, "white", 115, "white", 116, "white", 117, "white", 118, color, 119, color, 120, color, 121, "black", 122, "#D3D3D3", 123, "#D3D3D3", 124, "#D3D3D3", 125, "white", 126, "white", 127, "white", 128, "white", 129, "white", 130, "white", 131, "white", 132, "black", 133, color, 134, color, 135, color, 136, "black", 137, "#D3D3D3", 138, "#D3D3D3", 139, "white", 140, "white", 141, "white", 142, "white", 143, "white", 144, "white", 145, "#808080", 146, "black", 147, "#ffffff", 148, color, 149, color, 150, color, 151, "black", 152, "white", 153, "white", 154, "white", 155, "white", 156, "white", 157, "white", 158, "#808080", 159, "#808080", 160, "black", 161, "#ffffff", 162, "#ffffff", 163, color, 164, color, 165, color, 166, "#ffffff", 167, "black", 168, "white", 169, "white", 170, "white", 171, "white", 172, "#808080", 173, "#808080", 174, "black", 175, "#ffffff", 176, "#ffffff", 177, "#ffffff", 178, color, 179, color, 180, color, 181, "#ffffff", 182, "#ffffff", 183, "black", 184, "white", 185, "white", 186, "#808080", 187, "#808080", 188, "black", 189, "#ffffff", 190, "#ffffff", 191, "#ffffff", 192, "#ffffff", 193, color, 194, color, 195, "#ffffff", 196, "#ffffff", 197, "#ffffff", 198, "#ffffff", 199, "black", 200, "white", 201, "#808080", 202, "black", 203, "#ffffff", 204, "#ffffff", 205, "#ffffff", 206, "#ffffff", 207, "#ffffff", 208, color, 209, "#ffffff", 210, "#ffffff", 211, "#ffffff", 212, "#ffffff", 213, "#ffffff", 214, "#ffffff", 215, "black", 216, "black", 217, "#ffffff", 218, "#ffffff", 219, "#ffffff", 220, "#ffffff", 221, "#ffffff", 222, "#ffffff", 223, color, 224, "#ffffff", 225, "#ffffff"];
      toolIcons.penIcon._pixelCode = [18, 18, 20, 1, "#ffffff", 2, "#ffffff", 3, "#ffffff", 4, "#ffffff", 5, "#ffffff", 6, "#ffffff", 7, "#ffffff", 8, "#ffffff", 9, "#ffffff", 10, "#ffffff", 11, "#ffffff", 12, "#ffffff", 13, "#ffffff", 14, "#ffffff", 15, "#ffffff", 16, "#ffffff", 17, "#ffffff", 18, "black", 19, "#ffffff", 20, "#ffffff", 21, "#ffffff", 22, "#ffffff", 23, "#ffffff", 24, "#ffffff", 25, "#ffffff", 26, "#ffffff", 27, "#ffffff", 28, "#ffffff", 29, "#ffffff", 30, "#ffffff", 31, "#ffffff", 32, "#ffffff", 33, "#ffffff", 34, "#ffffff", 35, "black", 36, "#ffffff", 37, "#ffffff", 38, "#ffffff", 39, "#ffffff", 40, "#ffffff", 41, "#ffffff", 42, "#ffffff", 43, "#ffffff", 44, "#ffffff", 45, "#ffffff", 46, "#ffffff", 47, "#ffffff", 48, "#ffffff", 49, "#ffffff", 50, "#ffffff", 51, "#ffffff", 52, "black", 53, "#ffffff", 54, "#ffffff", 55, "#ffffff", 56, "#ffffff", 57, "#ffffff", 58, "#ffffff", 59, "#ffffff", 60, "#ffffff", 61, "#ffffff", 62, "#ffffff", 63, "#ffffff", 64, "#ffffff", 65, "#ffffff", 66, "#ffffff", 67, "#ffffff", 68, "#ffffff", 69, "black", 70, "#ffffff", 71, "#ffffff", 72, "#ffffff", 73, "#ffffff", 74, "#ffffff", 75, "#ffffff", 76, "#ffffff", 77, "#ffffff", 78, "#ffffff", 79, "#ffffff", 80, "#ffffff", 81, "#ffffff", 82, "#ffffff", 83, "#ffffff", 84, "#ffffff", 85, "#ffffff", 86, "black", 87, "black", 88, "#ffffff", 89, "#ffffff", 90, "#ffffff", 91, "#ffffff", 92, "#ffffff", 93, "#ffffff", 94, "#ffffff", 95, "#ffffff", 96, "#ffffff", 97, "#ffffff", 98, "#ffffff", 99, "#ffffff", 100, "#ffffff", 101, "#ffffff", 102, "#ffffff", 103, "black", 104, "black", 105, "#ffffff", 106, "#ffffff", 107, "#ffffff", 108, "#ffffff", 109, "#ffffff", 110, "#ffffff", 111, "#ffffff", 112, "#ffffff", 113, "#ffffff", 114, "#ffffff", 115, "#ffffff", 116, "#ffffff", 117, "#ffffff", 118, "#ffffff", 119, "black", 120, "black", 121, "black", 122, "black", 123, "#ffffff", 124, "#ffffff", 125, "#ffffff", 126, "#ffffff", 127, "#ffffff", 128, "#ffffff", 129, "#ffffff", 130, "#ffffff", 131, "#ffffff", 132, "#ffffff", 133, "#ffffff", 134, "#ffffff", 135, "#ffffff", 136, "black", 137, eraseColor, 138, eraseColor, 139, "black", 140, "#ffffff", 141, "#ffffff", 142, "#ffffff", 143, "#ffffff", 144, "#ffffff", 145, "#ffffff", 146, "#ffffff", 147, "#ffffff", 148, "#ffffff", 149, "#ffffff", 150, "#ffffff", 151, "#ffffff", 152, "#ffffff", 153, "black", 154, "black", 155, eraseColor, 156, eraseColor, 157, "black", 158, "#ffffff", 159, "#ffffff", 160, "#ffffff", 161, "#ffffff", 162, "#ffffff", 163, "#ffffff", 164, "#ffffff", 165, "#ffffff", 166, "#ffffff", 167, "#ffffff", 168, "#ffffff", 169, "#ffffff", 170, "black", 171, "black", 172, "black", 173, "black", 174, "black", 175, "#ffffff", 176, "#ffffff", 177, "#ffffff", 178, "#ffffff", 179, "#ffffff", 180, "#ffffff", 181, "#ffffff", 182, "#ffffff", 183, "#ffffff", 184, "#ffffff", 185, "#ffffff", 186, "#ffffff", 187, "black", 188, "black", 189, "black", 190, "#ffffff", 191, "#ffffff", 192, "#ffffff", 193, "#ffffff", 194, "#ffffff", 195, "#ffffff", 196, "#ffffff", 197, "#ffffff", 198, "#ffffff", 199, "#ffffff", 200, "#ffffff", 201, "#ffffff", 202, "#ffffff", 203, "black", 204, "black", 205, "black", 206, "black", 207, "black", 208, "#ffffff", 209, "#ffffff", 210, "#ffffff", 211, "#ffffff", 212, "#ffffff", 213, "#ffffff", 214, "#ffffff", 215, "#ffffff", 216, "#ffffff", 217, "#ffffff", 218, "#ffffff", 219, "black", 220, "black", 221, "black", 222, "black", 223, "black", 224, "black", 225, "#ffffff", 226, "#ffffff", 227, "#ffffff", 228, "#ffffff", 229, "#ffffff", 230, "#ffffff", 231, "#ffffff", 232, "#ffffff", 233, "#ffffff", 234, "#ffffff", 235, "#ffffff", 236, "black", 237, "black", 238, "black", 239, "black", 240, "black", 241, "black", 242, "black", 243, "#ffffff", 244, "#ffffff", 245, "#ffffff", 246, "#ffffff", 247, "#ffffff", 248, "#ffffff", 249, "#ffffff", 250, "#ffffff", 251, "#ffffff", 252, "#ffffff", 253, color, 254, "black", 255, "black", 256, "black", 257, "black", 258, "black", 259, "#ffffff", 260, "#ffffff", 261, "#ffffff", 262, "#ffffff", 263, "#ffffff", 264, "#ffffff", 265, "#ffffff", 266, "#ffffff", 267, "#ffffff", 268, "#ffffff", 269, "#ffffff", 270, "#ffffff", 271, color, 272, color, 273, "black", 274, "black", 275, "black", 276, "black", 277, "#ffffff", 278, "#ffffff", 279, "#ffffff", 280, "#ffffff", 281, "#ffffff", 282, "#ffffff", 283, "#ffffff", 284, "#ffffff", 285, "#ffffff", 286, "#ffffff", 287, "#ffffff", 288, "#ffffff", 289, color, 290, color, 291, color, 292, "black", 293, "#ffffff", 294, "#ffffff", 295, "#ffffff", 296, "#ffffff", 297, "#ffffff", 298, "#ffffff", 299, "#ffffff", 300, "#ffffff", 301, "#ffffff", 302, "#ffffff", 303, "#ffffff", 304, "#ffffff", 305, "#ffffff", 306, "#ffffff", 307, color, 308, color, 309, color, 310, color, 311, "#ffffff", 312, "#ffffff", 313, "#ffffff", 314, "#ffffff", 315, "#ffffff", 316, "#ffffff", 317, "#ffffff", 318, "#ffffff", 319, "#ffffff", 320, "#ffffff", 321, "#ffffff", 322, "#ffffff", 323, "#ffffff", 324, "#ffffff"];
      toolIcons.paintBucketIcon._2load(toolIcons.paintBucketIcon._pixelCode);
      toolIcons.penIcon._2load(toolIcons.penIcon._pixelCode);
    }

    $("#Palette").on('mousedown', '.color', function(event) {

        if (event.which == 1 && !ctrlDown) {
            paletteColor = $(this).css("background-color");
            color = rgb2hex(paletteColor);
            styleButtons();
            changeIconStyles();
        } else if (event.which == 3 && !ctrlDown) {
            eraseColor = rgb2hex($(this).css("background-color"));
            styleButtons();
            changeIconStyles();
        }
        else if (event.which == 1 && ctrlDown) {
            $(this).css('background-color', color);
        }
        else if (event.which == 3 && ctrlDown) {
          $(this).css("background-color", eraseColor)
        }
    });

    function getCellW(cell) {
        var cellID = cell.attr("id").split('_');
        return parseInt(cellID[1]);
    }

    function getCellH(cell) {
        var cellID = cell.attr("id").split('_');
        return parseInt(cellID[0]);
    }

    table.on('mousedown', '.drawable', function(event) {
      if (tool === 2 && event.which == 1) {

                  var clickedCellW = getCellW($(this));
                  var clickedCellH = getCellH($(this));
                  const clickedCellColor = $(this).css("background-color");
                  if (rgb2hex(clickedCellColor) !== color) {
                  fillToLimits(clickedCellH, clickedCellW)} else {
                    $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Plenty of that color in here!</p>');
                    $('.errorMessage').delay(1000).fadeOut(650);
                  }
                  function fillToLimits(cellH, cellW) {
                  var cell = table.find(`#${cellH}_${cellW}`);
                  var cellColor = cell.css("background-color");

                  if (cellColor!==clickedCellColor) {}

                  else {
                  cell.css("background-color", color);
                  fillToLimits(cellH, cellW+1);
                  fillToLimits(cellH-1, cellW);
                  fillToLimits(cellH+1, cellW);
                  fillToLimits(cellH, cellW-1);
                  }
                              }
        }

      else if (tool === 1 && event.which == 1) {

                isDrawing = true;
                $(this).css("background-color", color);

      }

      else if (tool === 2 && event.which == 3) {
                rightMouseButton=true;

                toolIcons.paintBucketIcon._pixelCode = [15, 15, 20, 1, "#ffffff", 2, "#ffffff", 3, "#ffffff", 4, "#ffffff", 5, "black", 6, "black", 7, "black", 8, "#ffffff", 9, "#ffffff", 10, "#ffffff", 11, "#ffffff", 12, "#ffffff", 13, "#ffffff", 14, "#ffffff", 15, "#ffffff", 16, "#ffffff", 17, "#ffffff", 18, "#ffffff", 19, "black", 20, "#ffffff", 21, "#ffffff", 22, "#ffffff", 23, "black", 24, "#ffffff", 25, "#ffffff", 26, "#ffffff", 27, "#ffffff", 28, "#ffffff", 29, "#ffffff", 30, "#ffffff", 31, "#ffffff", 32, "#ffffff", 33, "#ffffff", 34, "black", 35, "#ffffff", 36, "#ffffff", 37, "black", 38, "black", 39, "#ffffff", 40, "#ffffff", 41, "#ffffff", 42, "#ffffff", 43, "#ffffff", 44, "#ffffff", 45, "#ffffff", 46, "#ffffff", 47, "#ffffff", 48, "#ffffff", 49, "black", 50, "#ffffff", 51, "black", 52, "#D3D3D3", 53, "black", 54, "black", 55, "#ffffff", 56, "#ffffff", 57, "#ffffff", 58, "#ffffff", 59, "#ffffff", 60, "#ffffff", 61, "#ffffff", 62, "#ffffff", 63, "#ffffff", 64, "black", 65, "black", 66, "#D3D3D3", 67, "#D3D3D3", 68, "black", 69, "white", 70, eraseColor, 71, eraseColor, 72, "#ffffff", 73, "#ffffff", 74, "#ffffff", 75, "#ffffff", 76, "#ffffff", 77, "#ffffff", 78, "#ffffff", 79, "black", 80, "#D3D3D3", 81, "#D3D3D3", 82, "#D3D3D3", 83, "black", 84, "white", 85, "white", 86, "black", 87, eraseColor, 88, eraseColor, 89, "#ffffff", 90, "#ffffff", 91, "#ffffff", 92, "#ffffff", 93, "black", 94, "#D3D3D3", 95, "#D3D3D3", 96, "white", 97, "black", 98, "white", 99, "black", 100, "white", 101, "white", 102, "black", 103, eraseColor, 104, eraseColor, 105, eraseColor, 106, "#ffffff", 107, "black", 108, "#D3D3D3", 109, "#D3D3D3", 110, "#D3D3D3", 111, "white", 112, "white", 113, "black", 114, "white", 115, "white", 116, "white", 117, "white", 118, eraseColor, 119, eraseColor, 120, eraseColor, 121, "black", 122, "#D3D3D3", 123, "#D3D3D3", 124, "#D3D3D3", 125, "white", 126, "white", 127, "white", 128, "white", 129, "white", 130, "white", 131, "white", 132, "black", 133, eraseColor, 134, eraseColor, 135, eraseColor, 136, "black", 137, "#D3D3D3", 138, "#D3D3D3", 139, "white", 140, "white", 141, "white", 142, "white", 143, "white", 144, "white", 145, "#808080", 146, "black", 147, "#ffffff", 148, eraseColor, 149, eraseColor, 150, eraseColor, 151, "black", 152, "white", 153, "white", 154, "white", 155, "white", 156, "white", 157, "white", 158, "#808080", 159, "#808080", 160, "black", 161, "#ffffff", 162, "#ffffff", 163, eraseColor, 164, eraseColor, 165, eraseColor, 166, "#ffffff", 167, "black", 168, "white", 169, "white", 170, "white", 171, "white", 172, "#808080", 173, "#808080", 174, "black", 175, "#ffffff", 176, "#ffffff", 177, "#ffffff", 178, eraseColor, 179, eraseColor, 180, eraseColor, 181, "#ffffff", 182, "#ffffff", 183, "black", 184, "white", 185, "white", 186, "#808080", 187, "#808080", 188, "black", 189, "#ffffff", 190, "#ffffff", 191, "#ffffff", 192, "#ffffff", 193, eraseColor, 194, eraseColor, 195, "#ffffff", 196, "#ffffff", 197, "#ffffff", 198, "#ffffff", 199, "black", 200, "white", 201, "#808080", 202, "black", 203, "#ffffff", 204, "#ffffff", 205, "#ffffff", 206, "#ffffff", 207, "#ffffff", 208, eraseColor, 209, "#ffffff", 210, "#ffffff", 211, "#ffffff", 212, "#ffffff", 213, "#ffffff", 214, "#ffffff", 215, "black", 216, "black", 217, "#ffffff", 218, "#ffffff", 219, "#ffffff", 220, "#ffffff", 221, "#ffffff", 222, "#ffffff", 223, eraseColor, 224, "#ffffff", 225, "#ffffff"];
                toolIcons.paintBucketIcon._2load(toolIcons.paintBucketIcon._pixelCode);
                styleButtons();

                var clickedCellW = getCellW($(this));
                var clickedCellH = getCellH($(this));
                var clickedCellColor = $(this).css("background-color");
                if (rgb2hex(clickedCellColor) !== eraseColor) {
                fillToLimits(clickedCellH, clickedCellW)} else {
                  $("#messages").append('<p class="errorMessage text"><span class="error">Error:</span> Plenty of that color in here!</p>');
                  $('.errorMessage').delay(1000).fadeOut(650);
                }

                function fillToLimits(cellH, cellW) {
                var cell = table.find(`#${cellH}_${cellW}`);
                var cellColor = cell.css("background-color");

                if (cellColor!==clickedCellColor) {}

                else {
                cell.css("background-color", eraseColor);
                fillToLimits(cellH, cellW+1);
                fillToLimits(cellH-1, cellW);
                fillToLimits(cellH+1, cellW);
                fillToLimits(cellH, cellW-1);
                }
                            }

      }

      else if (tool === 1 && event.which == 3) {
                rightMouseButton = true;
                $(this).css("background-color", eraseColor);
                toolIcons.penIcon._pixelCode = [18, 18, 20, 1, "#ffffff", 2, "#ffffff", 3, "#ffffff", 4, "#ffffff", 5, "#ffffff", 6, "#ffffff", 7, "#ffffff", 8, "#ffffff", 9, "#ffffff", 10, "#ffffff", 11, "#ffffff", 12, "#ffffff", 13, "#ffffff", 14, "#ffffff", 15, "#ffffff", 16, "#ffffff", 17, "#ffffff", 18, "black", 19, "#ffffff", 20, "#ffffff", 21, "#ffffff", 22, "#ffffff", 23, "#ffffff", 24, "#ffffff", 25, "#ffffff", 26, "#ffffff", 27, "#ffffff", 28, "#ffffff", 29, "#ffffff", 30, "#ffffff", 31, "#ffffff", 32, "#ffffff", 33, "#ffffff", 34, "#ffffff", 35, "black", 36, "#ffffff", 37, "#ffffff", 38, "#ffffff", 39, "#ffffff", 40, "#ffffff", 41, "#ffffff", 42, "#ffffff", 43, "#ffffff", 44, "#ffffff", 45, "#ffffff", 46, "#ffffff", 47, "#ffffff", 48, "#ffffff", 49, "#ffffff", 50, "#ffffff", 51, "#ffffff", 52, "black", 53, "#ffffff", 54, "#ffffff", 55, "#ffffff", 56, "#ffffff", 57, "#ffffff", 58, "#ffffff", 59, "#ffffff", 60, "#ffffff", 61, "#ffffff", 62, "#ffffff", 63, "#ffffff", 64, "#ffffff", 65, "#ffffff", 66, "#ffffff", 67, "#ffffff", 68, "#ffffff", 69, "black", 70, "#ffffff", 71, "#ffffff", 72, "#ffffff", 73, "#ffffff", 74, "#ffffff", 75, "#ffffff", 76, "#ffffff", 77, "#ffffff", 78, "#ffffff", 79, "#ffffff", 80, "#ffffff", 81, "#ffffff", 82, "#ffffff", 83, "#ffffff", 84, "#ffffff", 85, "#ffffff", 86, "black", 87, "black", 88, "#ffffff", 89, "#ffffff", 90, "#ffffff", 91, "#ffffff", 92, "#ffffff", 93, "#ffffff", 94, "#ffffff", 95, "#ffffff", 96, "#ffffff", 97, "#ffffff", 98, "#ffffff", 99, "#ffffff", 100, "#ffffff", 101, "#ffffff", 102, "#ffffff", 103, "black", 104, "black", 105, "#ffffff", 106, "#ffffff", 107, "#ffffff", 108, "#ffffff", 109, "#ffffff", 110, "#ffffff", 111, "#ffffff", 112, "#ffffff", 113, "#ffffff", 114, "#ffffff", 115, "#ffffff", 116, "#ffffff", 117, "#ffffff", 118, "#ffffff", 119, "black", 120, "black", 121, "black", 122, "black", 123, "#ffffff", 124, "#ffffff", 125, "#ffffff", 126, "#ffffff", 127, "#ffffff", 128, "#ffffff", 129, "#ffffff", 130, "#ffffff", 131, "#ffffff", 132, "#ffffff", 133, "#ffffff", 134, "#ffffff", 135, "#ffffff", 136, "black", 137, color, 138, color, 139, "black", 140, "#ffffff", 141, "#ffffff", 142, "#ffffff", 143, "#ffffff", 144, "#ffffff", 145, "#ffffff", 146, "#ffffff", 147, "#ffffff", 148, "#ffffff", 149, "#ffffff", 150, "#ffffff", 151, "#ffffff", 152, "#ffffff", 153, "black", 154, "black", 155, color, 156, color, 157, "black", 158, "#ffffff", 159, "#ffffff", 160, "#ffffff", 161, "#ffffff", 162, "#ffffff", 163, "#ffffff", 164, "#ffffff", 165, "#ffffff", 166, "#ffffff", 167, "#ffffff", 168, "#ffffff", 169, "#ffffff", 170, "black", 171, "black", 172, "black", 173, "black", 174, "black", 175, "#ffffff", 176, "#ffffff", 177, "#ffffff", 178, "#ffffff", 179, "#ffffff", 180, "#ffffff", 181, "#ffffff", 182, "#ffffff", 183, "#ffffff", 184, "#ffffff", 185, "#ffffff", 186, "#ffffff", 187, "black", 188, "black", 189, "black", 190, "#ffffff", 191, "#ffffff", 192, "#ffffff", 193, "#ffffff", 194, "#ffffff", 195, "#ffffff", 196, "#ffffff", 197, "#ffffff", 198, "#ffffff", 199, "#ffffff", 200, "#ffffff", 201, "#ffffff", 202, "#ffffff", 203, "black", 204, "black", 205, "black", 206, "black", 207, "black", 208, "#ffffff", 209, "#ffffff", 210, "#ffffff", 211, "#ffffff", 212, "#ffffff", 213, "#ffffff", 214, "#ffffff", 215, "#ffffff", 216, "#ffffff", 217, "#ffffff", 218, "#ffffff", 219, "black", 220, "black", 221, "black", 222, "black", 223, "black", 224, "black", 225, "#ffffff", 226, "#ffffff", 227, "#ffffff", 228, "#ffffff", 229, "#ffffff", 230, "#ffffff", 231, "#ffffff", 232, "#ffffff", 233, "#ffffff", 234, "#ffffff", 235, "#ffffff", 236, "black", 237, "black", 238, "black", 239, "black", 240, "black", 241, "black", 242, "black", 243, "#ffffff", 244, "#ffffff", 245, "#ffffff", 246, "#ffffff", 247, "#ffffff", 248, "#ffffff", 249, "#ffffff", 250, "#ffffff", 251, "#ffffff", 252, "#ffffff", 253, eraseColor, 254, "black", 255, "black", 256, "black", 257, "black", 258, "black", 259, "#ffffff", 260, "#ffffff", 261, "#ffffff", 262, "#ffffff", 263, "#ffffff", 264, "#ffffff", 265, "#ffffff", 266, "#ffffff", 267, "#ffffff", 268, "#ffffff", 269, "#ffffff", 270, "#ffffff", 271, eraseColor, 272, eraseColor, 273, "black", 274, "black", 275, "black", 276, "black", 277, "#ffffff", 278, "#ffffff", 279, "#ffffff", 280, "#ffffff", 281, "#ffffff", 282, "#ffffff", 283, "#ffffff", 284, "#ffffff", 285, "#ffffff", 286, "#ffffff", 287, "#ffffff", 288, "#ffffff", 289, eraseColor, 290, eraseColor, 291, eraseColor, 292, "black", 293, "#ffffff", 294, "#ffffff", 295, "#ffffff", 296, "#ffffff", 297, "#ffffff", 298, "#ffffff", 299, "#ffffff", 300, "#ffffff", 301, "#ffffff", 302, "#ffffff", 303, "#ffffff", 304, "#ffffff", 305, "#ffffff", 306, "#ffffff", 307, eraseColor, 308, eraseColor, 309, eraseColor, 310, eraseColor, 311, "#ffffff", 312, "#ffffff", 313, "#ffffff", 314, "#ffffff", 315, "#ffffff", 316, "#ffffff", 317, "#ffffff", 318, "#ffffff", 319, "#ffffff", 320, "#ffffff", 321, "#ffffff", 322, "#ffffff", 323, "#ffffff", 324, "#ffffff"];
                toolIcons.penIcon._2load(toolIcons.penIcon._pixelCode);
                styleButtons();
      }
            displayEndResult(table);
    });

    table.on('mouseup', function(event) {
        rightMouseButton = false;
        isDrawing = false;
        saveSavePoint();
        displayEndResult(table);
        changeIconStyles();
        styleButtons();
    }); //stop following mouse movement when mouse is no longer down

    table.on('mouseleave', function(event) {
      if (rightMouseButton || isDrawing) {saveSavePoint();
      displayEndResult(table);
      rightMouseButton = false;
      isDrawing = false;
    } else {}
    changeIconStyles();
    styleButtons();
    }); //prevent continuation of drawing when entering with mouse after moving it out of grid while drawing

    table.on('mousemove', '.drawable', function(event) {
        if (tool === 2) {} else {
            if (isDrawing) {
                $(this).css('background-color', color);
            } else if (rightMouseButton) {
                $(this).css('background-color', eraseColor);
            }
            displayEndResult(table);
        }
    });

    eraseColor = $("#eraseColor").val();
    $("#eraseColor").on("change", function() {
        eraseColor = $(this).val();
        changeIconStyles();
    });
    $("#eraseColor").on("mousedown", function() {
        eraseColor = $(this).val();
        changeIconStyles();
    });


}); // end brackets of drawing functionality

$(function saveFunctionality() {
    const saveHTMLButton = $('#saveHTMLButton');
    saveHTMLButton.on("click", function(event) {
        $("#saveBox").children().remove();
        var endTableHTML = $(".end_result").html();
        $("#saveBox").append('<br><textarea rows="10" cols="41">' + endTableHTML +
            '</textarea> <br> <p class="text featureDescription">Paste this code somewhere on the web for your <br> pixel creation to show up!</p> ');
        $("#containerSaveBox").show();
    })
    const saveCodeButton = $('#saveCodeButton');
    saveCodeButton.on("click", function(event) {
        var gridWidthString = table.children().first().children().length;
        var gridWidth = parseInt(gridWidthString);
        var gridHeight = table.children().length;
        $("#saveBox").children().remove();
        var pixelCode = [gridHeight, " " + gridWidth, " " + $("#input_size").val()];
        var pixelCodeCells = 1;
        //Function to convert hex format to a rgb color, credits to Mottie of JSFiddle
        function rgb2hex(rgb) {
            rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
            return (rgb && rgb.length === 4) ? "" + //insert # for proper hex, remove for cleaner pixelCode
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
        }
        table.children().children().each(function() {
            pixelCode.push(" " + pixelCodeCells);
            pixelCode.push(" " + rgb2hex($(this).css("background-color")))
            pixelCodeCells++
        })
        $("#saveBox").append('<br><div class="flexalign"><div class="leftflex"><textarea rows="8" cols="12">' +
            pixelCode + '</textarea> </div> <div class="rightflex"> <label> <br> &nbsp; Copy and save this code to<br> somwhere safe so you can <br> load your progress later! </label></div></div>');
            $("#containerSaveBox").show();
    })
    const closeSaveBox = $("#closeSaveBox");
    closeSaveBox.on("click", function(event) {
      $("#containerSaveBox").hide();
    })

});
