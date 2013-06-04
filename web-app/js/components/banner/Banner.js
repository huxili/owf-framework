/**
 * @class Ozone.components.Banner
 * @extends Ext.Panel
 */
Ext.define('Ozone.components.banner.Banner', /** @lends Ozone.components.Banner.prototype */ {
    extend: 'Ext.toolbar.Toolbar',
    alias: ['widget.owfbanner', 'widget.Ozone.components.banner.Banner'],
    
    itemId: 'banner',
    cls: 'banner',

    mixins: {
        focus: 'Ozone.components.focusable.CircularFocus'
    },
    plugins: [
        new Ozone.components.focusable.Focusable(),
        new Ozone.plugins.Banner()
    ],

    // state of the banner
    // possible values are "docked", "mini" (popout), "collapsed" (chiklet)
    state: "docked",

    dashboardContainer: null,
    
    toolbarButtons: null,

    noItemsToShow: 2,

    collapseDelay: 5000,

    marketplaceButtonIndex: 3,

    hasMarketplaceButton: false,
    hasMetricButton: false,

    buttonSelectedCls: 'x-btn-default-toolbar-banner-large-selected',

    openLaunchMenu: function() {

        if(this.dashboardContainer.activeDashboard.configRecord.get('locked') === true) {
            return;
        }
        
        if (this.launchMenu.isVisible()) {
            this.launchMenu.close();
        }
        else {
            this.launchMenu.show();
            this.launchMenu.refresh();
        }
    },

    disableLaunchMenu: function() {
        if (this.launchMenu.isVisible()) {
            this.launchMenu.close();
        }
        this.getComponent('launchMenuBtn').disable();
        if (this.popOutToolbar) {
        	this.popOutToolbar.getComponent('launchMenuBtn').disable();
        }
    },

    enableLaunchMenu: function() {
        this.getComponent('launchMenuBtn').enable();
        if (this.popOutToolbar) {
        	this.popOutToolbar.getComponent('launchMenuBtn').enable();
        }
    },

    openSettingsWindow: function(){
        if (!this.settingsWindow || this.settingsWindow.isDestroyed) 
            this.settingsWindow = Ext.widget('settingswindow', {
                dashboardContainer: this.dashboardContainer
            });

        if (this.settingsWindow.isVisible()) {
            this.settingsWindow.close();
        }
        else {
            this.settingsWindow.show();
        }
    },

    openAdministrationWindow: function(){
        if (!this.administrationWindow || this.administrationWindow.isDestroyed) 
            this.administrationWindow = Ext.widget('admintoolswindow', {
                dashboardContainer: this.dashboardContainer
            });

        if (this.administrationWindow.isVisible())
            this.administrationWindow.hide();
        else
            this.administrationWindow.show();
    },
    openMarketplaceWindow: function(){
        if(this.hasMarketplaceButton) {
            if (!this.mpWindow) {
                this.mpWindow = Ext.widget('marketplace');
            }

            if (this.mpWindow.isVisible()) {
                this.mpWindow.close(); 
            }
            else {
                this.mpWindow.show();
            }
        }
        else {
            //Reset to enable all hotkeys since show wasn't executed
            Ozone.components.keys.KeyMap.reset();
        }
    },
    openMarketplaceModalWindow: function(btn, e) {
        var me = this;
        
        if (this.hasMarketplaceButton) {
            this.blinkMarketBtnAfterDashboardSwitch();
            if (!this.marketplaceToggle) {
                if (this.marketplaceWidget) {
                    var keyboard = ('keyup' == e.type) ? true : false;
                    e.stopEvent();
                    this.getMarketplaceLauncher().gotoMarketplace(this.marketplaceWidget, keyboard);
                } else {
                    this.getMarketplaceLauncher().gotoMarketplace(this.marketplaceWidget, null);
                }
            } else {
                this.dashboardContainer.activatePreviousDashboard();
                // This will be called as part of the previous dashboard change, but not if the previous
                // dashboard was the Marketplace dashboard, so call it here just to be safe.
                this.clearMarketplaceToggle();
                
                //Reset to enable all hotkeys since show wasn't executed
                Ozone.components.keys.KeyMap.reset();
            }
        } else {
            //Reset to enable all hotkeys since show wasn't executed
            Ozone.components.keys.KeyMap.reset();
        }
    },
    getMarketplaceLauncher: function() {
        if (!this.mpLauncher) {
            this.mpLauncher = Ext.create('Ozone.components.marketplace.MarketplaceLauncher', {
                 dashboardContainer: this.dashboardContainer
            });
            this.mpLauncher.addListener(OWF.Events.Marketplace.OPENED, this.setMarketplaceToggle, this);
        }
        return this.mpLauncher;
    },
    clearMarketplaceToggle: function() {
        this.marketplaceToggle = false;
        this.getComponent('marketBtn').removeCls(this.buttonSelectedCls);
    },
    setMarketplaceToggle: function() {
        this.marketplaceToggle = true;
        this.getComponent('marketBtn').addCls(this.buttonSelectedCls);
    },
    openMetricWindow: function() {
        if(this.hasMetricButton) {
            if(!this.metricWindow || this.metricWindow.isDestroyed) {
                this.metricWindow = Ext.widget('metricwindow', {
                    dashboardContainer: this.dashboardContainer
                });
            }
            if(this.metricWindow.isVisible()) {
                this.metricWindow.close();
            }
            else {
                this.metricWindow.show();
            }
        }
        else {
            //Reset to enable all hotkeys since show wasn't executed
            Ozone.components.keys.KeyMap.reset();
        }
    },
    openHelpWindow: function(){
      if (!this.helpWindow || this.helpWindow.isDestroyed) {
        this.helpWindow = Ext.widget('helpwindow', {
          constrainHeader: true,
          dashboardContainer: this.dashboardContainer
        });
      }
      if (this.helpWindow.isVisible()) {
          this.helpWindow.close();
      }
      else {
          this.helpWindow.show();
      }
    },
    
    addKeyBindings: function() {
        Ozone.KeyMap.addBinding([
            Ext.apply(Ozone.components.keys.HotKeys.LAUNCH_MENU, {
                scope: this,
                fn: this.openLaunchMenu
            }),
            Ext.apply(Ozone.components.keys.HotKeys.SETTINGS, {
                scope: this,
                fn: this.openSettingsWindow
            }),
            Ext.apply(Ozone.components.keys.HotKeys.DASHBOARD_SWITCHER, {
                scope: this.dashboardContainer,
                fn: this.dashboardContainer.showDashboardSwitcher
            }),
            Ext.apply(Ozone.components.keys.HotKeys.MARKETPLACE, {
                scope: this,
                exclusive: this.dashboardContainer.widgetStore.findWidgetsByType('marketplace').length > 1,
                fn: this.openMarketplaceModalWindow
            }),
            Ext.apply(Ozone.components.keys.HotKeys.METRIC, {
                scope: this,
                fn: this.openMetricWindow
            }),
            Ext.apply(Ozone.components.keys.HotKeys.HELP, {
                scope: this,
                fn: this.openHelpWindow
            })
        ]);

        if (this.user.isAdmin) {
          Ozone.KeyMap.addBinding(
            Ext.apply(Ozone.components.keys.HotKeys.ADMINISTRATION, {
              scope: this,
              fn: this.openAdministrationWindow
            }));
        }
    },

    initComponent: function() {
        var me = this;

        me.addKeyBindings();
        me.addEvents({
            docked : true,
            undocked : true
        });
        
        me.launchMenu = Ext.widget('launchMenu', {
            id: 'widget-launcher',
            dashboardContainer: me.dashboardContainer,
            hidden: true,
            listeners: {
                hide: {
                    fn: function() {
                        this.down('#launchMenuBtn').toggle(false, true);
                    },
                    scope: me
                },
                show: {
                    fn: function() {
                        this.down('#launchMenuBtn').toggle(true, true);
                    },
                    scope: me
                }
            }
        });

        me.items = [];
        me.items.push({
            xtype: 'button',
            id: "launchMenuBtn",
            itemId: "launchMenuBtn",
            // custom scale required for IE in quirks mode dropping all but last class on elements
            // TODO: revisit when a doctype is added
            scale: 'launchmenu-banner-large',
            iconAlign: 'top',
            text: null,
            cls: "bannerBtn launchMenuBtn",
            iconCls: 'launchMenuBtnIcon',
            enableToggle: true,
            clickCount: 0,
            handler: this.openLaunchMenu,
            scope: this,
            listeners: {
	        	afterrender: {
	        		fn: function(btn) {
	        			Ext.create('Ext.tip.ToolTip',{
	        				target: btn.getEl().id,
	        				title: Ozone.layout.tooltipString.addWidgetsTitle,
	                        html: Ozone.layout.tooltipString.addWidgetsContent,
	                        anchor: 'bottom',
	        			    anchorToTarget: true,
	        			    anchorOffset: -5,
	        			    mouseOffset: [5,0],
	        			    width: 500,
	        			    maxWidth: 500
	        			    
	        			    
	        			});
	        		}
	        	}
	        }
        }, '-');

        me.items.push([{
	        xtype: 'button',
	        id: 'dashMenuBtn',
	        text: null,
	        cls: 'bannerBtn dashMenuBtn',
	        iconCls: 'dashMenuBtnIcon',
	        iconAlign: 'top',
	        scale: 'banner-large',
	        enableToggle: true,
	        scope: this.dashboardContainer,
	        handler: this.dashboardContainer.showDashboardSwitcher,
	        listeners: {
	        	afterrender: {
	        		fn: me.dashMenuAfterRender,
                    scope: me
	        	}
	        }
        }, '-',
        // settings button
        {
            xtype: 'button',
            itemId: 'settingsBtn',
            cls: 'bannerBtn  settingsBtn',
            iconCls: 'settingsBtnIcon',
            scale: 'banner-large',
            iconAlign: 'top',
            text: null,
            enableToggle: true,
            scope: this,
            toggleHandler: this.openSettingsWindow,
            listeners: {
	        	afterrender: {
	        		fn: function(btn) {
	        			Ext.create('Ext.tip.ToolTip',{
	        				target: btn.getEl().id,
	        				title: Ozone.layout.tooltipString.settingsTitle,
	                        html: Ozone.layout.tooltipString.settingsContent,
	        			    anchor: 'bottom',
	        			    anchorToTarget: true,
	        			    anchorOffset: -5,
	        			    mouseOffset: [5,0],
	        			    width: 500,
	        			    maxWidth: 500            			    
	        			});
	        		}
	        	}
	        }
        }]);
        if (this.user.isAdmin) {
          me.items.push([
              '-',
              // admin button
              {
                  xtype: 'button',
                  itemId: 'adminBtn',
                  cls: 'bannerBtn  adminBtn',
                  iconCls: 'adminBtnIcon',
                  scale: 'banner-large',
                  iconAlign: 'top',
                  text: null,
                  enableToggle: true,
                  scope: this,
                  toggleHandler: this.openAdministrationWindow,
                  listeners: {
      	        	afterrender: {
      	        		fn: function(btn) {
      	        			Ext.create('Ext.tip.ToolTip',{
      	        				target: btn.getEl().id,
      	        				title: Ozone.layout.tooltipString.adminToolsTitle,
      	                      	html: Ozone.layout.tooltipString.adminToolsContent,
      	        			    anchor: 'bottom',
    	        			    anchorToTarget: true,
    	        			    anchorOffset: -5,
    	        			    mouseOffset: [5,0],
      	        			    width: 500,
      	        			    maxWidth: 500            			    
      	        			});
      	        		}
      	        	}
      	        }
              }]);
        }
        me.items.push([
            '-',
            // help button
            {
                xtype: 'button',
                itemId: 'helpBtn',
                cls: 'bannerBtn  helpBtn',
                iconCls: 'helpBtnIcon',
                scale: 'banner-large',
                iconAlign: 'top',
                text: null,
                handler: this.openHelpWindow,
                scope: this,
                listeners: {
      	        	afterrender: {
      	        		fn: function(btn) {
      	        			Ext.create('Ext.tip.ToolTip',{
      	        				target: btn.getEl().id,
      	        				title: Ozone.layout.tooltipString.helpTitle,
      	                      	html: Ozone.layout.tooltipString.helpContent,
      	        			    anchor: 'bottom',
    	        			    anchorToTarget: true,
    	        			    anchorOffset: -5,
    	        			    mouseOffset: [5,0],
      	        			    width: 500,
      	        			    maxWidth: 500            			    
      	        			});
      	        		}
      	        	}
      	        }
            }, '-'
       ]);
       if(Ozone.config.bannerPopoutEnabled){
	       me.items.push([
	            // popout button
	            {
	                xtype: 'button',
	                id: 'popOutBannerBtn',
	                cls: 'popOutBannerBtn ',
	                iconCls: 'popOutBannerBtnIcon',
	                iconAlign: 'top',
	                scale: 'banner-large',
	                width: 10,
	                text: null,
	                tooltip: {
	                    title: Ozone.layout.tooltipString.bannerUndockTitle,
	                    text: Ozone.layout.tooltipString.bannerUndockContent,
	                    width: 280,
	                    maxWidth: 280
	                },
	                handler: this.popOutDockedBanner,
	                scope: this
	            }
	       ]);
       }
       me.items.push([

            // The logo image is now provided by css on the inner box div (x-box-inner) of the
            // banner toolbar. The next two configs remain for spacing
            {
              xtype: 'component',
              itemId: 'logoImg',
              flex: 6.75,
              cls: 'logo-img'
            },
            {
                xtype: 'component',
                flex: 1
            },
            // user menu button
            {
                xtype: 'usermenubutton',
                id: 'userMenuBtn',
                user: this.user,
                dashboardContainer: this.dashboardContainer
            }
        ]);
 
        function setupCircularFocus() {
            var firstEl = this.items.get(0).getFocusEl(),
                userMenuBtn = this.getComponent('userMenuBtn'),
                lastEl = this.getComponent('userMenuBtn').getClickables().last();

            function unhideMenu() {
                userMenuBtn.showUserMenu();
            }

            this.setupFocus(firstEl, lastEl, undefined, unhideMenu);
        }

        me.on('afterrender', function(cmp) {
            setupCircularFocus.call(cmp);

            Ozone.components.focusable.Focusable.clearOutline(this.getEl());
        });

        me.callParent(arguments);

        this.on({
          render: {
            fn: function() {
              if(Ozone.config.banner.state === "mini") {
                  me.popOutDockedBanner(false, Ozone.config.banner.position);
              }
              else if(Ozone.config.banner.state === "collapsed") {
                  me.popOutDockedBanner(true, Ozone.config.banner.position);
              }
            },
            scope: this
          }
        });

        this.dashboardContainer.addListener(OWF.Events.Dashboard.CHANGED, this.clearMarketplaceToggle, this);
    },

    //returns either the docked banner or the popout banner,
    //depending on which one is in use
    getBanner: function() {
        if (this.popOutToolbar && this.popOutToolbar.isVisible())
            return this.popOutToolbar;
        else
            return this;
    },

    getPopOutBanner: function() {
        var me = this,
            popOutButtons = [],
            launchMenuBtn = this.getComponent('launchMenuBtn');

        if(me.popOutToolbar) {
            return me.popOutToolbar;
        }

        popOutButtons.push(
            {
                id: 'gripper',
                xtype: 'component'
            },
            {
                id: 'popout_logo',
                xtype: 'component'
            }
        );

        popOutButtons.push(launchMenuBtn.cloneConfig({
                id: 'popWidgetButton',
                clickCount: launchMenuBtn.clickCount,
                disabled: this.getComponent('launchMenuBtn').disabled
            }), '-',
            this.getComponent('dashMenuBtn').cloneConfig(), '-'
        );

        if (this.hasMarketplaceButton) {
            popOutButtons.push(this.getComponent('marketBtn').cloneConfig(), '-');
        }


        if (this.hasMetricButton) {
            popOutButtons.push(this.getComponent('metricBtn').cloneConfig(), '-');
        }

        popOutButtons.push(this.getComponent('settingsBtn').cloneConfig(), '-');

        if (this.user.isAdmin) {
          popOutButtons.push(
              this.getComponent('adminBtn').cloneConfig(), '-'
          );
        }
        
        if(Ozone.config.bannerPopoutEnabled){
	        popOutButtons.push(
	            this.getComponent('helpBtn').cloneConfig(), '-',
	            {
	                xtype: 'button',
	                id: 'popInBannerBtn',
	                cls: 'popInBannerBtn',
	                iconCls: 'popInBannerBtnIcon',
	                iconAlign: 'top',
	                scale: 'banner-large',
	                width: 10,
	                text: null,
	                tooltip: {
	                    title: Ozone.layout.tooltipString.bannerDockTitle,
	                    text: Ozone.layout.tooltipString.bannerDockContent,
	                    width: 200,
	                    maxWidth: 200
	                },
	                handler: this.dockPopOutBanner,
	                scope: this
	            }
	        );
        }

        me.popOutToolbar = Ext.create("Ext.toolbar.Toolbar", {
            id: 'popOutBanner',
            cls: 'banner',
            constrain: true,
            ownerCt: me.dashboardContainer,
            floating : true,
            draggable: true,
            state: 'full',
            // fixedZIndex: 1000000,
            plugins: [
                new Ozone.components.keys.KeyMoveable(),
                new Ozone.components.focusable.Focusable()
            ],
            bindMovementKeys: function() {
                var me = this,
                    keys = {},
                    moveKeys = Ozone.components.keys.MoveHotKeys,
                    keyArr,
                    keymap;

                function createKeyBinding(key, action) {
                    return Ext.copyTo({
                        //create our own handler and scope
                        handler: function(key, evt) {
                            evt.stopPropagation();
                            action();
                        },
                        scope: me 
                    }, 
                    key, //also copy properties from key
                    Ext.Array.difference(   //copy all properties from key except fn, handler, and scope
                        Ext.Object.getKeys(key), 
                        ['fn', 'handler', 'scope']
                    ));
                }

                keys.MOVE_UP = createKeyBinding(moveKeys.MOVE_UP, Ext.bind(me.moveUp, me));

                keys.MOVE_DOWN = createKeyBinding(moveKeys.MOVE_DOWN, Ext.bind(function() {
                    this.moveDown(Ext.getCmp('mainPanel').getHeight());
                }, me));

                keys.MOVE_LEFT = createKeyBinding(moveKeys.MOVE_LEFT, Ext.bind(me.moveLeft, me));

                keys.MOVE_RIGHT = createKeyBinding(moveKeys.MOVE_RIGHT, Ext.bind(function() {
                    this.moveRight(Ext.getCmp('mainPanel').getWidth());
                }, me));

                keyArr = Ext.Object.getValues(keys);

                //keys for navigating within toolbar using LEFT and right
                keyArr.push({
                    key: [Ext.EventObject.LEFT, Ext.EventObject.RIGHT],
                    handler: function(key, evt) {
                        //move the either the previousSibling or nextSibling
                        if (!evt.ctrlKey) {
                            var property = evt.getKey() === evt.LEFT ? 'previousSibling' : 'nextSibling',
                                currentFocus = this.getChildByElement(document.activeElement),
                                toFocus = currentFocus ? currentFocus[property]('.button') : null;

                            if (toFocus) toFocus.focus();
                        }
                    }, 
                    scope: this
                });


                //attach to the x-box-inner so that we can block keys from going
                //up to the main toolbar and changing focus
                keymap = new Ext.util.KeyMap(this.getFocusEl(), keyArr);

                this.on('destroy', function() {
                    this.destroy();
                }, keymap);

                //we cannot unsubscribe on afterrender because
                //the subscription itself does not happen until afterrender
                this.on('show', function() {
                    Ext.FocusManager.unsubscribe(this);
                }, this);

            },
            items : [popOutButtons]
        });

        me.popOutToolbar.on('move',
            function() {
                this.saveState();
            }, me, {buffer: 500});

        me.popOutToolbar.on('afterrender', function(cmp) {
            var items = cmp.items.items,
                lastEl = items[items.length-1].getEl(),
                width = lastEl.getOffsetsTo(cmp.getEl())[0] + lastEl.getWidth();
            
            cmp.originalWidth = width + 5;
            cmp.originalHeight = cmp.getHeight();

            cmp.setWidth(cmp.originalWidth);
            cmp.setHeight(cmp.originalHeight);

            cmp.getEl().on('mouseout', me.startCollapseTimer, me);
            cmp.getEl().on('blur', me.startCollapseTimer, me);
            cmp.getEl().on('mouseover', me.clearCollapseTimer, me);
            cmp.getEl().on('focus', function() {
                me.clearCollapseTimer(); 
                me.expandBanner();
            }, me);

            Ozone.components.focusable.Focusable.clearOutline(cmp.getFocusEl());
            cmp.bindMovementKeys();

            //returns the first focusable component in
            //items.  We assume a component is focusable
            //if it has a getFocusEl function that returns
            //an element that is actually focusable
            cmp.items.firstFocusable = function() {
                return this.findBy(function(item) {
                    return (item.getFocusEl && item.getFocusEl().focusable());
                });
            };

            //mixins can only be added to classes, not instances,
            //so we cannot use this mixin properly here.  So instead
            //I manually invoke the setupFocus method
            Ext.apply(cmp, new Ozone.components.focusable.CircularFocus());
            cmp.setupFocus(cmp.items.firstFocusable().getFocusEl(),
                cmp.items.last().getFocusEl());

            if (Ext.isIE) {
                //for some reason, tabindex on all extra items in the
                //toolbar gets set to 0.  We need to reset it so that
                //people can tab through the toolbar without hitting
                //extra elements
                Ext.defer(function() {
                    this.getEl().select('.x-toolbar-separator, #gripper, #popout_logo')
                    .each(function (item) {
                        item.dom.tabIndex = -1;
                    });
                }, 100, cmp);
            }

        }, null, {
            single: true
        });

        me.popOutToolbar.on('show', function() {
            //Ensure it's on top
            me.dashboardContainer.bannerManager.register(me.popOutToolbar);
            me.dashboardContainer.bannerManager.bringToFront(me.popOutToolbar);
            
            //Fix bug where height somehow gets set to 0
            if(this.height < this.originalHeight) {
                this.setHeight(this.originalHeight);
            }
        });
        
        return me.popOutToolbar;
    },
    
    popOutDockedBanner: function(disableAnim, position){
        var me = this,
            popOutBanner = me.getPopOutBanner();
        
        me.hide();

        if(popOutBanner.rendered) {
            popOutBanner.setHeight(popOutBanner.originalHeight);
        }
        
        me.state = "mini";
        popOutBanner.show();
        me.fireEvent(OWF.Events.Banner.UNDOCKED);

        if(position && position.length == 2) {
            popOutBanner.setPosition(position[0], position[1]);
        }
        disableAnim === true ? me.collapseMiniBanner(0) : me.startCollapseTimer();
        me.resizePopOutBanner();

        //Required to fix odd behavior where resizePopOutBanner resizes to about 19 pixels
        //under certain circumstances.
        if(this.popOutToolbar.width < 50) {
            me.resizePopOutBanner();
        }

        this.saveState();
    },

    dockPopOutBanner: function() {
        var me = this;

        me.state = "docked";
        me.fireEvent(OWF.Events.Banner.DOCKED);
        me.clearCollapseTimer();
        me.setHeight(34);
        me.setVisible(true);
        me.popOutToolbar.hide();
        me.focus();

        this.saveState();
    },
    
    startCollapseTimer: function() {
        var me = this;
        if (!me.collapseTask) {
            me.collapseTask = Ext.create('Ext.util.DelayedTask', function() {
                if (me.popOutToolbar.getEl().contains(document.activeElement))
                    //if focus is still in the banner, try again later
                    me.startCollapseTimer();
                else
                    me.collapseMiniBanner();
            });
        }
        me.collapseTask.delay(Ext.isNumber(me.collapseDelay) ? me.collapseDelay : 5000, null, me);
    },

    clearCollapseTimer: function() {
        var me = this;
        if(me.collapseTask) {
            me.collapseTask.cancel();
            me.collapseTask = null;
            me.expandBanner();
        }
    },

    collapseMiniBanner: function(duration) {
        var me = this,
            popOutBanner = this.getPopOutBanner(),
            items = popOutBanner.items.items;

        if(!popOutBanner.miniWidth) {
            popOutBanner.miniWidth = items[me.noItemsToShow].getEl().getOffsetsTo(popOutBanner.getEl())[0];
        }
        popOutBanner.animate({
            easing: 'elasticIn',
            duration: Ext.isNumber(duration) ? duration : 500,
            to: {
                width: popOutBanner.miniWidth
            },
            listeners: {
                afteranimate: function() {
                  if (me.state != 'docked') {
                    me.state = "collapsed";
                  }
                }
            }
        });
    },

    expandBanner: function() {
        var me = this,
            popOutBanner = this.getPopOutBanner(),
            items = popOutBanner.items.items;

        if(popOutBanner.originalWidth 
            && popOutBanner.originalWidth !== popOutBanner.getSize().width) {
            
            popOutBanner.animate({
                easing: 'backOut',
                duration: 500,
                to: {
                    width: popOutBanner.originalWidth
                },
                listeners: {
                    afteranimate: function() {
                      if (me.state != 'docked') {
                        me.state = "mini";
                      }
                    }
                }
            });
        }
    },

    resizePopOutBanner: function() {
        var banner = this.getPopOutBanner(),
                    items = banner.items.items,
                    lastEl = items[items.length-1].getEl(),
                    width = lastEl.getOffsetsTo(banner.getEl())[0] + lastEl.getWidth();

        banner.originalWidth = width + 5;
        banner.setWidth(banner.originalWidth);
    },

    saveState: function(cb) {
        var me = this,
            value = {
                state: me.state,
                position: me.isVisible() || !me.popOutToolbar ? [0, 0] : me.popOutToolbar.getPosition()
            };

        Ozone.pref.PrefServer.setUserPreference({
            namespace: "owf.banner",
            name: "state",
            value: Ozone.util.toString(value),
            onSuccess: function(result) {
              if (cb != null) {
                cb();
              }
            },
            onFailure: function() {}
        });
    },

    addMarketplaceButton: function(widget) {
        this.marketplaceWidget = widget;

        if(!this.hasMarketplaceButton) {
            var banner = this, popOutIndexModifier = 0;
            banner.insert(this.marketplaceButtonIndex + popOutIndexModifier, {xtype:'tbseparator',itemId:'mpSeparator'});
            banner.insert(this.marketplaceButtonIndex + 1 + popOutIndexModifier,{
                xtype: 'button',
                itemId: 'marketBtn',
                cls: 'bannerBtn  marketBtn',
                iconCls: 'marketplaceBtnIcon',
                scale: 'banner-large',
                iconAlign: 'top',
                text: null,
                scope: this,
                handler: this.openMarketplaceModalWindow,
                listeners: {
    	        	afterrender: {
    	        		fn: function(btn) {
    	        			Ext.create('Ext.tip.ToolTip',{
    	        				target: btn.getEl().id,
    	        				title: Ozone.layout.tooltipString.marketplaceWindowTitle,
    	                        html: Ozone.layout.tooltipString.marketplaceWindowContent,
    	        			    anchor: 'bottom',
    	        			    anchorToTarget: true,
    	        			    anchorOffset: -5,
    	        			    mouseOffset: [5,0],
    	        			    width: 500,
    	        			    maxWidth: 500            			    
    	        			});
    	        		}
    	        	}
    	        }
            });
            
            if(this.popOutToolbar) {
                if(!this.popOutToolbar.getComponent('marketBtn')) {
                    this.popOutToolbar.insert(this.marketplaceButtonIndex + 2, {xtype:'tbseparator',itemId:'mpSeparator'});
                    this.popOutToolbar.insert(this.marketplaceButtonIndex + 3, this.getComponent('marketBtn').cloneConfig());
                    this.resizePopOutBanner();
                }
            }

            this.hasMarketplaceButton = true;
        }
    },
    removeMarketplaceButton: function() {
        if(this) {
            var marketBtnIndex = this.items.indexOf(this.getComponent('marketBtn'));
            this.remove(marketBtnIndex);
            this.remove(marketBtnIndex - 1); //Remove separator
        }

        if(this.popOutToolbar) {
            var marketBtnIndex = this.popOutToolbar.items.indexOf(this.popOutToolbar.getComponent('marketBtn'));
            this.popOutToolbar.remove(marketBtnIndex);
            this.popOutToolbar.remove(marketBtnIndex - 1);
            this.resizePopOutBanner();
        }

        this.hasMarketplaceButton = false;
    },

    addMetricButton: function() {
        var index = this.hasMarketplaceButton ? this.marketplaceButtonIndex + 2 : this.marketplaceButtonIndex;
        if(!this.hasMetricButton) {
            var banner = this, popOutIndexModifier = 0;
            banner.insert(index + popOutIndexModifier, {xtype:'tbseparator',itemId:'metricSeparator'});
            banner.insert(index + 1 + popOutIndexModifier,{
                xtype: 'button',
                itemId: 'metricBtn',
                cls: 'bannerBtn  metricBtn',
                iconCls: 'metricBtnIcon',
                scale: 'banner-large',
                iconAlign: 'top',
                text: null,
                scope: this,
                handler: this.openMetricWindow,
                listeners: {
    	        	afterrender: {
    	        		fn: function(btn) {
    	        			Ext.create('Ext.tip.ToolTip',{
    	        				target: btn.getEl().id,
    	        				title: Ozone.layout.tooltipString.metricWindowTitle,
    	                        html: Ozone.layout.tooltipString.metricWindowContent,
    	        			    anchor: 'bottom',
    	        			    anchorToTarget: true,
    	        			    anchorOffset: -5,
    	        			    mouseOffset: [5,0],
    	        			    width: 500,
    	        			    maxWidth: 500            			    
    	        			});
    	        		}
    	        	}
    	        }
            });
        }

        if(this.popOutToolbar) {
            if(!this.popOutToolbar.getComponent('metricBtn')) {
                this.popOutToolbar.insert(index + 2, {xtype:'tbseparator',itemId:'metricSeparator'});
                this.popOutToolbar.insert(index + 3, this.getComponent('metricBtn').cloneConfig());
                this.resizePopOutBanner();
            }
        }

        this.hasMetricButton = true;
    },
    removeMetricButton: function() {
        if(this) {
            var metricBtnIndex = this.items.indexOf(this.getComponent('metricBtn'));
            this.remove(metricBtnIndex);
            this.remove(metricBtnIndex - 1); //Remove separator
        }

        if(this.popOutToolbar) {
            var metricBtnIndex = this.popOutToolbar.items.indexOf(this.popOutToolbar.getComponent('metricBtn'));
            this.popOutToolbar.remove(metricBtnIndex);
            this.popOutToolbar.remove(metricBtnIndex - 1);
            this.resizePopOutBanner();
        }

        this.hasMetricButton = false;
    },

    dashMenuAfterRender: function(btn) {
        Ext.create('Ext.tip.ToolTip',{
            target: btn.getEl().id,
            title: Ozone.layout.tooltipString.dashboardSwitcherTitle,
            html: Ozone.layout.tooltipString.dashboardSwitcherContent,
            anchor: 'bottom',
            anchorToTarget: true,
            anchorOffset: -5,
            mouseOffset: [5,0],
            width: 500,
            maxWidth: 500                           
        });

        
    },

    blinkMarketBtnAfterDashboardSwitch: function () {
        var btn = this.getComponent('marketBtn');

        this.dashboardContainer.on(OWF.Events.Dashboard.CHANGED, function (guid, dashboard) {
            if(!Modernizr.cssanimations) {
                // wait 6 seconds if dashboard hasn't rendered
                // otherwise frame animation won't be visible to user
                setTimeout(function() {
                    btn.blink();
                }, dashboard.rendered ? 0: 6000);
            }
            else {
                btn.blink();
            }
        }, null, {
            single: true
        });
    }

});
