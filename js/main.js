$(function() {

  // Image Rotation Loader

  var preload;
  var image_list = [];
  var image_map = {};

  for (var i = 0; i <= 2; i++) {
    image_map[i] = {};

    for (var j = 0; j <= 9; j++) {
      image_map[i][j] = null;

      var reference = "img/cloudo_3d/{0}_{1}.jpg";
      reference = reference.replace("{0}", i);
      reference = reference.replace("{1}", j);

      var data = {
        i: i,
        j: j,
        src: reference
      };

      image_list.push( data );
    }
  }

  function loadImageHanderComplete(e) {
    console.log( "complete" );

    $('#cloudo_3d_view_progress').addClass( "fadeOut" );
    setTimeout(function() {
      $('#cloudo_3d_view_progress').remove();

      $('#cloudo_3d_view .image_view').toggleClass("loading fadeIn");
    }, 1000);
  }

  function loadImageHanderCompleteFile(e) {
    var item = e.item;
    var img = $(e.result);

    img.addClass( "image_view" );

    image_map[ item.i ][ item.j ] = img
  }

  function loadImageHanderProgress(e) {
    console.log('TOTAL: ' + preload.progress);

    var percent = preload.progress * 100;

    $('#cloudo_3d_view_progress').data("percent", percent).empty().circliful();
  }

  function loadImage() {
    preload = new createjs.LoadQueue();

    preload.addEventListener("fileload", loadImageHanderCompleteFile);
    preload.addEventListener("complete", loadImageHanderComplete);
    preload.addEventListener("progress", loadImageHanderProgress);

    preload.setMaxConnections(5);

    image_list.forEach( function( reference ) {
      preload.loadFile( reference );
    });
  }

  $('#cloudo_3d_view_progress').circliful();
  loadImage();

  // Image Rotation Controller

  var current_x = 4;
  var current_y = 1;
  var last_x = 4;
  var last_y = 1;

  var data = {
    last_mouse_x : 0,
    last_mouse_y : 0
  };

  var diff_limit = 30;

  function change_3d_view(x, y) {
    // var img = image_map[y][x];
    // console.log( img );

    $("#cloudo_3d_view .image_view").replaceWith( image_map[y][x] );
  }

  $("#cloudo_3d_view").on("dragstart", function(e) {
    $(this).data("dragging", true);

    // data.last_mouse_x = e.screenX;
    // data.last_mouse_y = e.screenY;

    return false;
  });

  $("#cloudo_3d_view").on("mousemove", function(e) {
    var dragging = $(this).data("dragging");

    if (dragging) {
      var x = e.screenX;
      var y = e.screenY;
      var direction;

      if ( Math.abs( x - data.last_mouse_x ) > diff_limit ) {

        direction = x > data.last_mouse_x ? -1 : x < data.last_mouse_x ? 1 : 0;

        current_x += direction;
        current_x = Math.max( Math.min( current_x, 9 ), 0 );

        data.last_mouse_x = e.screenX;
      }

      if ( Math.abs( y - data.last_mouse_y ) > diff_limit ) {

        direction = y > data.last_mouse_y ? 1 : y < data.last_mouse_y ? -1 : 0;

        current_y += direction;
        current_y = Math.max( Math.min( current_y, 2 ), 0 );

        data.last_mouse_y = e.screenY;
      }

      // console.log( current_x );
      // console.log( current_y );
      // console.log("###########");

      change_3d_view( current_x, current_y );
    }
  });

  $("#cloudo_3d_view").on("mouseup", function(e) {
    $(this).data("dragging", false);
  });

  $("#cloudo_3d_view").on("mouseleave", function(e) {
    $(this).data("dragging", false);
  });
});
