console.log('app.js loaded');

(function ($) {
    // obtain a query string
    getUrlVars = function() {
        var vars = [],
          hash;
        var hashes = window.location.href
          .slice(window.location.href.indexOf("?") + 1)
          .split("&");
        for (var i = 0; i < hashes.length; i++) {
          hash = hashes[i].split("=");
          vars.push(hash[0]);
          vars[hash[0]] = hash[1];
        }
        return vars;
    };
    var vars = getUrlVars();

    // set a cookie, get a cookie
    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for(var i=0;i < ca.length;i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') c = c.substring(1,c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
        }
        return null;
    }

    // concerns the alert banner close button
    $('#alerts i.fa-times-circle-o').on('click', function(){
        console.log('alert close');
        setCookie('hidealert','yes',1);
        $('#alerts').hide();
    })
    let ck = getCookie('hidealert');
    if(!ck){ $('#alerts').show(); }

    // concerns the hamburger menu
    $('#navbarSupportedContent .fa-times-circle-o').on('click', function () {
        $('.navbar-toggler').click();
    });
    $('#shade').on('click', function () {
        $('.navbar-toggler').click();
    });


    // concerns the Feature Model page feature
    let featureModelPick = [];

    const featureModelClick =()=> {
        $('#featureModelFilter a').once().on('click', function (e) {
            e.preventDefault();
            let thisOption = $(this).attr('data-option');

            $('#featureModelFilter a').removeClass('active');
    
            $(this).toggleClass('active');
    
            if (thisOption == 'all') {
                
                window.location.href = "/featured-models";
            } else {
                //console.log(thisOption);
                if ($(this).hasClass('active')) {
                    //console.log('is active');
                    $('#views-exposed-form-featured-models-page-1 select.form-select option[value="' + thisOption + '"]').prop("selected", true);
                    featureModelPick = [];
                    featureModelPick.push(thisOption);
                } else {
                    //console.log('not active');
                    let pickIndex = featureModelPick.indexOf(thisOption);
                    //console.log(pickIndex);
                    if (pickIndex > -1) {
                        featureModelPick.splice(pickIndex, 1);
                    }
                    $('#views-exposed-form-featured-models-page-1 select.form-select option[value="' + thisOption + '"]').prop("selected", false);
                }
            }
    
            $('#views-exposed-form-featured-models-page-1 input.js-form-submit').click();
            console.log(featureModelPick);
    
        })
    }

    if (vars['tid[]']) {
        let selectedTerm = vars["tid[]"];
        $('#featureModelFilter a').each(function(){
            if($(this).attr('data-option') == selectedTerm) {
                $(this).addClass('active');
            }
        });
        featureModelPick.push(selectedTerm);
        $('#featureModelFilter a[data-option="all"').removeClass('active');
    }
    
    featureModelClick();
    
    // on ajax complete function for the feature models page
    // to capture the selected taxonomy
    // and update the model filter buttons accordingly

    $(document).ajaxComplete(function (event, request, settings) {
        featureModelClick();

        $('#featureModelFilter a').each(function () {
            if (featureModelPick.includes($(this).attr('data-option'))) {
                //console.log('true');
                $(this).addClass('active');
                $('a[data-option=all]').removeClass('active');
            } else {
                //console.log('false');
            }
        })

    });

    if($('.glide').length > 0) { 
        
        //console.log('has glide');
        const glide = new Glide('.glide', {
            type: 'carousel',
            startAt: 0,
            perView: 4,
          breakpoints: {
              800: {
                 perView: 3
              },
              600: {
                perView: 1
              }
            }
          })
          
          glide.on('build.after', function() {
              var slideHeight = $('.glide__slide--active').outerHeight();
          
              var glideTrack = $('.glide__track').outerHeight();
          
              if (slideHeight != glideTrack) {
                  var newHeight = slideHeight;
                  $('.glide__track').css('height', newHeight + 20);
                          $('.resource-card').css('height', newHeight + 20);
                          $('.glide__arrows').css('top', - newHeight / 2);
              }
          });
          
          
          
          glide.mount({});
     };


     // leavenotice interstitial modal
     let windowhost = window.location.hostname;

    $('.ext-link').leaveNotice({
        exitMessage: "<p>Following this link will allow you to search all Taconic Biosciences models on taconic.com - you will be leaving taconicbiociences.cn</p><p>通过此链接，您可以在taconic.com上搜索所有Taconic Biosciences模型-您将离开taconicbiociences.cn</p>",
        preLinkMessage: "<hr/>",
        closeMessage: "Click below to be directed to / 点击下面的链接进入:<br>{URL}<br><br>Once you find a model of interest, you may submit your order via either www.taconicbiosciences.cn or www.taconic.com.<br><br>找到感兴趣的模型后，您可以通过www.taconicbiosciences.cn或www.taconic.com提交订单。<br><br><a href=\"#close\" id=\"ln-cancelLink\">Cancel / 取消</a>",
        siteName: windowhost,
        newWindow: true,
        messageBoxId: "losetheborder"
    }, function(){
        console.log('leave it!');
    });

    window.addEventListener('click', function(e){
        if (document.getElementById('losetheborder')) {
            if (document.getElementById('losetheborder').contains(e.target)){
              // Clicked in box
              //console.log('inside');
            } else{
              // Clicked outside the box
              //console.log('out');
              $('#ln-cancelLink').click();
            }
        }

    });

}(jQuery));

