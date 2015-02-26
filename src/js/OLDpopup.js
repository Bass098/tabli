/**
 * OLD, pre-React jQuery code.
 * Kept around for reference during port to React/Flux, but
 * SHOULD BE REMOVED  (code still in github repo for popup.js)
 */


function insertAfter(referenceNode, newNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function refreshPopup() {
  window.location.href="popup.html";
}

function initManageDialog() {
  /*
  var subject = $("#subject"),
      allFields = $( [] ).add( subject );
  $("#manage-dialog").dialog({
        autoOpen: false,
        height: 200,
        width: 280,
        modal: true,
        buttons: {
          "Create": function() {
            var bValid = true;
            allFields.removeClass( "ui-state-error" );

            if ( bValid ) {
              var tabWindow = $( this ).data( "tabWindow" );
              console.log( "manage window:", tabWindow );
              var subjField = $( "#subject" );
              var windowTitle = subjField.val();
              bgw.tabMan.manageWindow( tabWindow, { title: windowTitle } );
              $( this ).dialog( "close" );
              refreshPopup();
            }
          },
          Cancel: function() {
            $( this ).dialog( "close" );
          }
        },
        close: function() {
          allFields.val( "" ).removeClass( "ui-state-error" );
        }
      });
  */ 
}

function makeElem( tag, options ) {
  var item = document.createElement( tag );
  if( options ) {
    var txt = options.text;
    if( txt )
      item.appendChild( document.createTextNode(txt) );
    var classes = options.classes;
    if( classes ) {
      for ( var i = 0; i < classes.length; i++ ) {
        item.classList.add( classes[ i ] );
      }
    }
    var parent = options.parent;
    if( parent ) {
      parent.appendChild( item );
    }
    var attrs = options.attributes;
    if( attrs ) {
      for( var attr in attrs ) {
        if( !attrs.hasOwnProperty( attr ) )
          continue;
        item.setAttribute( attr, attrs[attr] );
      }
    }
  }

  return item;
};

function mkChangeClassHandler( element, addClassName, removeClassName ) {
  return function() {
    if ( addClassName )
      element.classList.add( addClassName );
    if ( removeClassName )
      element.classList.remove( removeClassName );
  };
}

/* 
 * Show the target element when hovering on the subject element
 */
 function showWhenHoverOn( target, subject ) {
  target.classList.add( 'show-on-hover' );
  subject.addEventListener( "mouseover", mkChangeClassHandler( target, 'hover', 'show-on-hover' ) );
  subject.addEventListener( "mouseout", mkChangeClassHandler( target, 'show-on-hover', 'hover' ) );
}


function renderTabWindowHeader( tabWindow, current, windowPanelId ) {
  var managed = tabWindow.isManaged();
  var windowTitle = tabWindow.getTitle();
  var windowId = tabWindow.chromeWindow && tabWindow.chromeWindow.id;

  function windowCloseHandler() {
    chrome.windows.remove( windowId, function() {
      tabWindow.open = false;
      if ( !managed ) {
        var windowElem = windowHeader.parentNode;
        var windowParent = windowElem.parentNode;
        windowParent.removeChild( windowElem );
      }
    });
  }

  var windowHeader = makeElem( 'div', 
    { classes: [ "nowrap", "singlerow", "oneRowContainer", "windowHeader" ] } );

  var openClass = tabWindow.open ? "open" : "closed";

  // We want to use a lighter, icon-based checkmark for the checked state, so this
  // is a little involved...

  var windowCheckItem;
  if( managed ) {
    windowCheckItem =  makeElem( 'button',
      { classes: [ "header-button", "window-managed" ],
        parent: windowHeader,
        attributes: { title: "Stop managing this window"}
      } );  
    windowCheckItem.onclick = function() {
      // managed --> unmanaged:
      // TODO: confirmation dialog
      bgw.tabMan.unmanageWindow( tabWindow );
      refreshPopup();                
    };
  } else {
    windowCheckItem = makeElem( 'input',
      { classes: [ "header-button" ], parent: windowHeader,
        attributes: { type: "checkbox", title: "Bookmark this window (and all its tabs)" }
      } );
    showWhenHoverOn( windowCheckItem, windowHeader );
    windowCheckItem.onchange = function() {
      console.log( "toggle manage for '", windowTitle, "'" );
      var checked = windowCheckItem.checked;
      console.log( "state:", checked );
      if( checked ) {
        // unmanaged --> managed:
        var dlg = $("#manage-dialog" );
        var subjField = $( "#subject" );
        subjField.val( windowTitle );
        window.setTimeout( function() {
          subjField[0].setSelectionRange( 0, windowTitle.length );
        }, 0 );
        dlg.data( "tabWindow", tabWindow );
        dlg.dialog( "open" );
      }
    }
  }

  var expandButtonClass = tabWindow.open ? "window-collapse" : "window-expand";
  var windowExpandButton = makeElem( 'button',
      { classes: [ "header-button", "expander", expandButtonClass ],
        parent: windowHeader,
        attributes: { title: "Expand window contents"}
      } ); 
  windowExpandButton.onclick = function() {
    console.log( "Got click on expander" );
    var obj = $("#" + windowPanelId + " .expandable-panel-content");
    if (windowExpandButton.classList.contains( "window-expand" ) ) {
      // obj.animate({'margin-top':0}, 500 );
      obj.css('margin-top',"0px" );
      windowExpandButton.classList.remove( "window-expand" );
      windowExpandButton.classList.add( "window-collapse" );
    } else {
      // var ht = parseInt( contentHeight );
      var ht = 500;
      //obj.animate({'margin-top':"-" + (ht + 30) + "px" }, 500 );
      obj.css('margin-top',"-500px");
      windowExpandButton.classList.remove( "window-collapse" );        
      windowExpandButton.classList.add( "window-expand" );
    }
  };

  var windowTitleItem = makeElem( 'span', 
    { text: windowTitle, 
      classes: [ "windowList", "nowrap", "singlerow", "windowTitle", openClass ],
      parent: windowHeader 
    });
  windowTitleItem.onclick = function() {
    console.log( "clicked on window '", windowTitle, "'" );
    if( tabWindow.open ) {
      chrome.windows.update( windowId, { focused: true } );
    } else {
      // need to open it!
      bgw.tabMan.restoreBookmarkWindow( tabWindow );
      refreshPopup();
    }
  };

  if ( tabWindow.open ) {
    if ( managed ) {
      var windowRevertButton = makeElem( 'button',
        { classes: [ "header-button", "revert-spacer", "revert-window" ],
          parent: windowHeader,
          attributes: { title: "Revert to bookmarked tabs" }
        });
      showWhenHoverOn( windowRevertButton, windowHeader );
      windowRevertButton.onclick = function () {
        bgw.tabMan.revertWindow( tabWindow, refreshPopup );
      }
    } else {
      var revertSpacer = makeElem( 'div',
        { classes: [ "header-button", "revert-spacer" ],
          parent: windowHeader
        } );
    }
    var windowCloseButton = makeElem( 'button',
      { classes: [ "header-button", "close" ],
        parent: windowHeader,
        attributes: { title: "Close Window" }
      });
    showWhenHoverOn( windowCloseButton, windowHeader );
    windowCloseButton.onclick = windowCloseHandler;
  }

  return windowHeader;
}

function renderTabItem( tabWindow, tab, tabIndex ) {
  var managed = tabWindow.isManaged();
  var windowId = tabWindow.chromeWindow && tabWindow.chromeWindow.id;

  function makeTabClickHandler( windowId, tabId, isClosed ) {
    function handler() {
      console.log( "clicked on tab for tab id ", tabId );
      if( tabWindow.open ) {
        if ( !isClosed ) {
          chrome.tabs.update( tabId, { active: true } );
          chrome.windows.update( windowId, { focused: true } );
        } else {
          // restore this bookmarked tab:
          var createOpts = {
            windowId: tabWindow.chromeWindow.id, 
            url: tab.url,
            index: tabIndex,
            active: true
          };
          chrome.tabs.create( createOpts, function () {
            titleItem.classList.remove("closed");
            titleIem.classList.add("open");  
          });
        }
      } else {
        bgw.tabMan.restoreBookmarkWindow( tabWindow );
        refreshPopup();
      }        
    };
    return handler;
  }

  function makeTabCloseHandler( tabElement, windowId, tabId ) {
    function handler() {
      chrome.tabs.remove( tabId );
      tabElement.parentNode.removeChild( tabElement );
    }
    return handler;
  }

  function makeTabRemoveBookmarkHandler( tab ) {
    function handler() {
      console.log( "about to remove bookmark for tab: ", tab );
      chrome.bookmarks.remove( tab.bookmark.id, function () {
        console.log( "succesfully removed bookmark" );
        tabWindow.reloadBookmarkFolder();
        refreshPopup();
      } );
    }
    return handler;
  }

  function makeTabAddBookmarkHandler( tab ) {
    function handler() {
      var tabMark = { parentId: tabWindow.bookmarkFolder.id, title: tab.title, url: tab.url };
      chrome.bookmarks.create( tabMark, function( tabNode ) { 
        console.log( "Successfully added bookmark for tab ',", tab.title, "'" );
        tabWindow.reloadBookmarkFolder();
        refreshPopup();
      } );
    }
    return handler;
  }

  var openClass = tabWindow.open ? "open" : "closed";
  var tabOpenClass = openClass;
  var tabItem = makeElem( 'div', 
    { classes: [ "singlerow", "nowrap", "oneRowContainer", "tabinfo" ] } );

  if ( managed ) {
    if( !tab.open )
      tabOpenClass = "closed";

    var tabCheckItem;

    if (tab.bookmarked ) {
      tabCheckItem = makeElem( 'button',
        { classes: [ "header-button", "tab-managed" ],
          parent: tabItem,
          attributes: { title: "Remove bookmark for this tab"}
        } );
      tabCheckItem.onclick = makeTabRemoveBookmarkHandler( tab );
    } else {
      tabCheckItem = makeElem( 'input',
        { classes: [ "header-button" ], parent: tabItem,
          attributes: { type: "checkbox", title: "Bookmark this tab" }
        } );
      showWhenHoverOn( tabCheckItem, tabItem );
      tabCheckItem.onchange = makeTabAddBookmarkHandler( tab );
    }
  } else {
    var tabCheckSpacer = makeElem( 'div',
      { classes: [ "header-button" ],
        parent: tabItem
      } );

  }

  var tabFavIcon = makeElem('img', { classes: [ "favicon" ], parent: tabItem } );
  if ( tab.favIconUrl )
    tabFavIcon.setAttribute( 'src', tab.favIconUrl );

  var tabTitleClasses = [ "windowList", "nowrap", "singlerow", tabOpenClass ];
  if( tab.active ) {
    tabTitleClasses.push( "activeTab" );
  }
  var titleItem = makeElem( 'span', 
    { text: tab.title,
      classes: tabTitleClasses,
      parent: tabItem
    });
  titleItem.onclick = makeTabClickHandler( windowId, tab.id, tabOpenClass === "closed" );

  if ( tabWindow.open ) {
    var closeButton = makeElem( 'button',
      { classes: [ "header-button", "close" ],
        parent: tabItem,
        attributes: { title: "Close Tab" }
      });

    showWhenHoverOn( closeButton, tabItem );

    closeButton.onclick = makeTabCloseHandler( tabItem, windowId, tab.id );
  }

  return tabItem;
}

function renderTabWindow( tabWindow, current, windowPanelId ) {
  var managed = tabWindow.isManaged();
  var windowTitle = tabWindow.getTitle();
  var tabs = tabWindow.getTabItems();
  var windowId = tabWindow.chromeWindow && tabWindow.chromeWindow.id;

  // console.log( "renderTabWindow: title: ", windowTitle, ", tabWindow: ", tabWindow );
  // console.log( "tabs:", tabs );
  var groupHeaderId = current ? 'currentWindow' : ( managed ? 'managedWindows' : 'unmanagedWindows' );
  var windowItem = makeElem( 'div', { classes: [ "windowInfo", "expandable-panel" ], 
    attributes: { id: windowPanelId } } );


  var windowHeader = renderTabWindowHeader( tabWindow, current, windowPanelId, windowItem );

  var expandableContentClass = tabWindow.open ? "expandable-panel-content-open" : "expandable-panel-content-closed";
  var tabListItem = makeElem('div', { classes: [ "tablist", "expandable-panel-content", expandableContentClass ] } );
  for( var i = 0; i < tabs.length; i++ ) {
    var tab = tabs[ i ];

    var tabItem = renderTabItem( tabWindow, tab, i );

    tabListItem.appendChild( tabItem );
  }
  windowItem.appendChild( windowHeader ); 
  windowItem.appendChild( tabListItem );

  var winGroupHeader= document.getElementById( groupHeaderId );
  insertAfter( winGroupHeader, windowItem );

  var panelContent = $("#" + windowPanelId + " .expandable-panel-content");
  // var contentHeight = panelContent.css('height');
  if ( !window.open ) {
    panelContent.css('margin-top',"-500px" );
  }
}

/*
 * initialize global expand / collapse all toggle button
 */
 function initExpandToggle() {
  var toggleElem = $('#expandToggle');
  toggleElem.click( function() {
    /* 
     * Okay, this is where HTML really shows itself as a terrible programming model.
     * We use the presence of the class name to squirrel away the state of the
     * toggle button, and then we manipulate the expand / collapse state of every
     * button and also apply the manipulation needed to expand / collapse every
     * expandable panel, instead of just asking each panel to expand or collapse itself.
     */
    var iconElem = $( this ).find( '.top-button-icon' );
    var collapse = iconElem.hasClass( 'window-collapse' );
    iconElem.toggleClass('window-collapse').toggleClass('window-expand');

    var expandButtons = $( '.expander' );
    var expandPanels = $( '.expandable-panel-content' );
    if ( collapse ) {
      // collapse all windows
      expandButtons.removeClass('window-collapse').addClass('window-expand');
      expandPanels.css('margin-top', '-500px' );
    } else {
      // expand all windows
      expandButtons.addClass('window-collapse').removeClass('window-expand');
      expandPanels.css('margin-top', '0px' );
    }
  });
 }


