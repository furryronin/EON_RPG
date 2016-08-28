"use strict";function map(e,t){var o=[];return forEach(e,function(e){o.push(t(e))}),o}var colorize=function(e,t){return'<span style="color: '+t+';">'+e+"</span>"},roll=function(e,t){return Math.floor(Math.random()*(t-e+1))+e},getObj=function(e,t){var o=e.filter(function(e){return e.name===t});return o?o[0]:null},getFromArr=function(e,t){var o=e.filter(function(e){return e.slot===t});return o?o[0]:null},removeFromArr=function(e,t){var o=e.indexOf(t);o>-1&&e.splice(o,1)},getObjLvl=function(e,t){for(var o=[],n=0;n<e.length;n++)e[n].level===t&&o.push(e[n]);return o},forEach=function(e,t){for(var o=0;o<e.length;o++)t(e[o])},forEachMethod=function(e,t){for(var o=0;o<e.length;o++)e[o][t]()},bindToMany=function(e,t,o){for(var n=document.querySelectorAll(e),a=0;a<n.length;a++)n[a][t]=o},getName=function(e){return e.name},getRandomLootByLevel=function(e,t){var o=getObjLvl(Items[e],t);return o[roll(0,o.length-1)]},colorHealth=function(e){var t=[36,251,39],o=[255,104,57],n=t[0],a=t[1],r=t[2];return n+=(o[0]-t[0])*(1-e),a-=(t[1]-o[1])*(1-e),r+=(o[2]-t[2])*(1-e),"rgb("+n.toFixed(0)+", "+a.toFixed(0)+", "+r.toFixed(0)+")"},GameState={currentMoment:"",setCurrentMoment:function(e){this.currentMoment=e,UI.narrative.renderMoment(),this.checkForAndCreateChoices(),this.checkForAndPickUpLoot(),this.checkForAndRunCombat(),this.checkForAndOpenUpShop(),this.checkForAndRunInn(),this.checkForAndRunOnLoad(),UI.scrollToBottom(UI.narrative.el)},checkForAndRunOnLoad:function(){this.currentMoment.hasOwnProperty("onLoad")&&this.currentMoment.onLoad()},processRandomLoot:function(e){var t;return t="object"==typeof e?getRandomLootByLevel(e[0],e[1]):getObj(Items.all,e)},checkForAndPickUpLoot:function(){var e=this.currentMoment.hasOwnProperty("dropLoot")&&!this.currentMoment.hasOwnProperty("enemy");e&&Player.pickUpLoot()},checkForAndRunCombat:function(){this.currentMoment.hasOwnProperty("enemy")&&Combat.runCombat()},checkForAndOpenUpShop:function(){this.currentMoment.hasOwnProperty("shop")?(UI.narrative.renderShop(),this.bindShopItemEvents()):this.bindWorldItemEvents()},checkForAndRunInn:function(){var e=this.currentMoment.hasOwnProperty("inn");if(e){var t=this.currentMoment.inn;Player.gold>=t?(Player.updateGold(-t),Player.healthTotal=Player.healthMax,Player.updateStats(),UI.combatLog.renderCombatLog(colorize("You",UI.colors.player)+" bought a room for "+colorize(t+" gold",UI.colors.gold)+"."),UI.combatLog.renderCombatLog(colorize("Your",UI.colors.player)+" health is "+colorize("fully restored","#24fb27"))):UI.combatLog.renderCombatLog(colorize("You",UI.colors.player)+" need "+colorize(t-Player.gold,UI.colors.gold)+" to get a room.")}},checkForAndCreateChoices:function(){var e=this.currentMoment.hasOwnProperty("choices");e&&UI.narrative.renderChoices()},bindWorldItemEvents:function(){for(var e=UI.inventory.el.querySelectorAll("[data-item]"),t=0;t<e.length;t++)e[t].onclick=UI.inventory.activateItem},bindShopItemEvents:function(){for(var e=UI.narrative.el.querySelectorAll("[data-item]"),t=UI.inventory.el.querySelectorAll("[data-item]"),o=0;o<e.length;o++)e[o].onclick=Player.purchaseItem;for(var n=0;n<t.length;n++)t[n].onclick=Player.sellItem},messages:{gainLvl:colorize("You gained a level! Your toughness and quickness have increased by 1.","yellow")}},Player={name:"You",level:1,healthMax:25,healthTotal:25,armor:0,toughness:0,quickness:1,equippedWeapon:"",equippedArmor:{head:"",chest:"",back:"",belt:"",pants:"",boots:""},inventory:[],gold:0,experience:0,levelUp:function(){this.level=this.level+1,this.toughness=this.toughness+1,this.quickness=this.quickness+1,this.healthTotal=this.healthMax,this.updateStats(),UI.combatLog.renderCombatLog(GameState.messages.gainLvl)},calcNexLevelExp:function(){for(var e=80,t=0;t<this.level;t++)e+=20*(t+1);return e},updateExperience:function(e){this.experience=this.experience+e,UI.combatLog.renderCombatLog(colorize("You","#fff")+" gained "+colorize(e+" experience.","#fff"))},updateStats:function(){this.setHealth(),this.setDamage(),this.setArmor(),this.setToughness(),this.setDamageReduction(),this.setQuicknessProc(),UI.statlist.renderStats()},updateGold:function(e){this.gold+=e,UI.inventory.renderGold()},setHealth:function(){this.health=""+this.healthTotal+"/"+this.healthMax,UI.combat.updateHealthBar()},setArmor:function(){this.armor=0;for(var e in this.equippedArmor)this.equippedArmor[e].armorAmt&&(this.armor+=this.equippedArmor[e].armorAmt);this.armor+=this.toughness},setDamage:function(){this.equippedWeapon?this.damage=""+this.equippedWeapon.damage[0]+"-"+this.equippedWeapon.damage[1]:this.damage="0-2"},setDamageReduction:function(){this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)},setToughness:function(){this.healthMax=25+this.toughness},setQuicknessProc:function(){this.quicknessProc=(.02*this.quickness/(1+.02*this.quickness)*100).toFixed(2)},getBaseDamage:function(){return this.equippedWeapon?roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]):roll(0,3)},rollQuicknessProc:function(){return roll(0,100)<=this.quicknessProc?!0:!1},attack:function(e){var t=Math.round(this.getBaseDamage()*e.damageReduction),o,n,a="",r="hit",i="yellow",s=this.rollQuicknessProc(),l=e.rollQuicknessProc(),c;if(this.equippedWeapon.effect){var m=this.equippedWeapon.effect;o="itemProc"===m[m.length-1].constructor.name,n=m[m.length-1].run()}if(s&&(t=2*t,r=""+colorize("critically hit",UI.colors.red),i=UI.colors.red),o&&n){var u=m[m.length-1],h;h="You"===this.name?"Your":this.name+"'s",e.healthTotal-=u.amt,a=" and "+colorize(this.equippedWeapon.name,UI.colors[this.equippedWeapon.rarity])+" hits for "+colorize(u.amt,"yellow")}l?UI.combatLog.renderCombatLog(colorize(e.healthTotal,colorHealth(e.healthTotal/e.healthMax))+" "+colorize(e.name,UI.colors.entity)+" "+colorize("dodged","yellow")+" "+colorize(this.name,UI.colors.entity)+" for 0"):(e.healthTotal-=t,c=colorize(this.healthTotal,colorHealth(this.healthTotal/this.healthMax))+" "+colorize(this.name,UI.colors.entity)+" "+r+" "+colorize(e.name,UI.colors.entity)+" for "+colorize(t,i),UI.combatLog.renderCombatLog(c+a)),Player.updateStats()},pickUpGold:function(){var e=getObj(Enemies,GameState.currentMoment.enemy).level,t=roll(4,8)*e;Player.updateGold(t),UI.combatLog.renderCombatLog(""+colorize("You",UI.colors.player)+" found "+colorize(t+" gold.",UI.colors.gold))},pickUpLoot:function(){var e=map(GameState.currentMoment.dropLoot,GameState.processRandomLoot);forEach(e,Player.addToInventory),UI.combatLog.renderLootMessage(e)},addToInventory:function(e){Player.inventory.push(e),UI.inventory.renderInventoryItem(e)},removeFromInventory:function(e,t){removeFromArr(this.inventory,e),UI.inventory.removeInventoryItem(t)},equipWeapon:function(e){this.equippedWeapon&&this.unequipCurrentWeapon(),this.equippedWeapon=e,this.updateStats()},equipArmor:function(e){var t=this.equippedArmor[e.slot];t&&Player.unequipArmor(this.equippedArmor[e.slot]),this.equippedArmor[e.slot]=e,this.updateStats()},unequipArmor:function(e){this.equippedArmor[e.slot]="",e.effect&&forEachMethod(e.effect,"remove")},removeWepBuff:function(e){var t="statBuff"===e.constructor.name;t===!0&&e.remove()},unequipCurrentWeapon:function(){var e=this.equippedWeapon;e.effect&&forEach(e.effect,this.removeWepBuff),e&&(e="")},purchaseItem:function(){var e=this.getAttribute("data-item"),t=getObj(Items.all,e),o=Player.gold>=t.getPurchasePrice();o?(Player.updateGold(-t.getPurchasePrice()),Player.addToInventory(t),UI.combatLog.renderItemTransaction(colorize(t.name,UI.colors[t.rarity]),t.getPurchasePrice(),"bought")):UI.combatLog.renderCannotPurchaseMessage(colorize(t.name,UI.colors[t.rarity]),t.getPurchasePrice())},sellItem:function(){var e=this.getAttribute("data-item"),t=getObj(Items.all,e);Player.updateGold(t.getSalePrice()),t===Player.equippedWeapon&&Player.unequipCurrentWeapon(),t===Player.equippedArmor[t.slot]&&Player.unequipArmor(t),Player.removeFromInventory(t,this),Player.updateStats(),UI.itemDescription.hideItemDescription(),UI.combatLog.renderItemTransaction(colorize(t.name,UI.colors[t.rarity]),t.getSalePrice(),"sold")},reset:function(){this.name="You",this.level=1,this.healthMax=25,this.healthTotal=25,this.armor=0,this.toughness=0,this.quickness=1,this.equippedWeapon="",this.equippedArmor={head:"",chest:"",back:"",belt:"",pants:"",boots:""},this.inventory=[],this.gold=0,this.experience=0,Player.updateStats(),Player.updateGold(0)}},UI={colors:{none:"#939DBD",common:"#fff",rare:"#0047FF",epic:"#9E65C4",legendary:"#C6AF66",set:"#32cbb4",entity:"#fff",player:"#fff",enemy:"#fff",gold:"#E5CA48",red:"#ff6839",green:"#24fb27"},narrative:{el:document.getElementById("narrative"),getMomentByClick:function(){var e=this.getAttribute("data-moment");GameState.setCurrentMoment(Moments["moment"+e])},renderShopItem:function(e){var t=document.createElement("a"),o=document.createTextNode(e.name);t.setAttribute("data-item",e.name),UI.itemDescription.bindEvents(t),t.appendChild(o),UI.narrative.el.appendChild(t),t.onclick=Player.purchaseItem},renderShop:function(){var e=map(GameState.currentMoment.shop,GameState.processRandomLoot);forEach(e,UI.narrative.renderShopItem),bindToMany("#inventory [data-item]","onclick",Player.sellItem)},renderChoice:function(e){var t=document.createElement("a"),o=document.createTextNode(e.message);t.setAttribute("data-moment",e.link),t.appendChild(o),t.onclick=UI.narrative.getMomentByClick,UI.narrative.el.appendChild(t)},renderChoices:function(){var e=GameState.currentMoment.choices;forEach(e,UI.narrative.renderChoice)},renderMoment:function(){UI.narrative.el.innerHTML="";var e=document.createElement("p"),t=document.createTextNode(GameState.currentMoment.message);e.appendChild(t),UI.narrative.el.appendChild(e)}},statlist:{el:document.getElementById("stat-list"),renderStat:function(e){var t=e.parentNode.getAttribute("data-stat");e.innerHTML=Player[t]},renderStats:function(){var e=this.el.querySelectorAll("div");forEach(e,this.renderStat)}},inventory:{el:document.getElementById("inventory"),gold:document.getElementById("gold"),renderInventoryItem:function(e){var t=document.createElement("li"),o=document.createTextNode(e.name),n=GameState.currentMoment.hasOwnProperty("shop"),a="armor"===e.itemType&&e===Player.equippedArmor[e.slot],r=Player.equippedWeapon&&e===Player.equippedWeapon;t.appendChild(o),t.setAttribute("data-item",e.name),UI.itemDescription.bindEvents(t),UI.inventory.el.appendChild(t),n?GameState.bindShopItemEvents():GameState.bindWorldItemEvents(),r&&UI.inventory.renderEquippedWeapon(t),a&&t.classList.add("equipped-armor")},removeInventoryItem:function(e){e.remove()},renderInventory:function(){this.el.innerHTML="",forEach(Player.inventory,this.renderInventoryItem)},renderGold:function(){UI.inventory.gold.innerHTML=Player.gold},removeEquippedWepTag:function(){var e=document.querySelector(".equipped-wep");e&&e.classList.remove("equipped-wep")},removeEquippedArmorTag:function(){for(var e=document.querySelectorAll(".equipped-armor"),t=0;t<e.length;t++)e[t].classList.remove("equipped-armor")},renderEquippedWeapon:function(e){this.removeEquippedWepTag(),e.classList.add("equipped-wep")},renderEquippedArmor:function(){this.removeEquippedArmorTag();for(var e in Player.equippedArmor)Player.equippedArmor[e].name&&UI.inventory.el.querySelector('[data-item="'+Player.equippedArmor[e].name+'"').classList.add("equipped-armor")},activateItem:function(){var e=this.getAttribute("data-item"),t=getObj(Items.all,e),o=Player.equippedWeapon!==t&&t!==Player.equippedArmor[t.slot];o&&("weapon"===t.itemType?(Player.equipWeapon(t),UI.inventory.renderEquippedWeapon(this),t.use()):"armor"===t.itemType&&(Player.equipArmor(t),UI.inventory.renderEquippedArmor(),t.use())),"consumable"===t.itemType&&(Player.removeFromInventory(t,this),UI.itemDescription.hideItemDescription(),t.use()),"quest"===t.itemType&&t.use()}},itemDescription:{el:document.getElementById("itemDescription"),items:document.getElementById("descItems"),initialX:0,initialY:0,getInitialY:function(e){var t=e.pageY;return UI.itemDescription.intialY=t,t},getInitialX:function(e){var t=e.pageX;return UI.itemDescription.intialX=t,t},position:function(e){var t=UI.itemDescription,o=window.innerWidth,n=window.innerHeight,a=t.getInitialX(e),r=t.getInitialY(e),i="translate3d("+a+"px,"+r+"px, 0)";e.pageX+(t.el.offsetWidth+10)>o?t.el.style.left=t.initialX-t.el.offsetWidth-10+"px":t.el.style.left=t.initialX+10+"px",e.pageY+(t.el.offsetHeight+10)>n?t.el.style.top=t.initialY-t.el.offsetHeight-10+"px":UI.itemDescription.el.style.top=t.initialY+10+"px",t.el.style.webkitTransform=i,t.el.style.transform=i},showItemDescription:function(){UI.itemDescription.el.style.display="block"},hideItemDescription:function(){UI.itemDescription.el.style.display="none"},createEl:function(e,t){var o=document.createElement("div"),n=document.createTextNode(e);return o.classList.add(t),o.appendChild(n),o},renderItemDescription:function(){UI.itemDescription.items.innerHTML="";var e=this.getAttribute("data-item"),t=getObj(Items.all,e),o;for(var n in t)if("function"!=typeof t[n]){if(o="damage"===n?UI.itemDescription.createEl(t[n][0]+"-"+t[n][1],""+n):UI.itemDescription.createEl(t[n],""+n),"effect"===n){o=UI.itemDescription.createEl(t[n].description,""+n);for(var a=0;a<t.effect.length;a++)o=UI.itemDescription.createEl(t[n][a].description,""+n),UI.itemDescription.items.appendChild(o)}"rarity"===n&&(document.querySelector(".name").style.color=UI.colors[t[n]]),"flavorText"===n&&""===t[n]||UI.itemDescription.items.appendChild(o)}else if("getSalePrice"===n&&this.parentNode===UI.inventory.el){if(o=UI.itemDescription.createEl(t[n](),""+n),UI.itemDescription.items.appendChild(o),GameState.currentMoment.hasOwnProperty("shop")){var r=UI.itemDescription.createEl("(Click to sell)","shop-item");UI.itemDescription.items.appendChild(r)}}else if("getPurchasePrice"===n&&this.parentNode===UI.narrative.el&&(o=UI.itemDescription.createEl(t[n](),""+n),UI.itemDescription.items.appendChild(o),GameState.currentMoment.hasOwnProperty("shop"))){var i=UI.itemDescription.createEl("(Click to buy)","shop-item");UI.itemDescription.items.appendChild(i)}UI.itemDescription.showItemDescription()},getStatDescriptions:{wep:Player.equippedWeapon,level:function(){return"You have "+Player.experience+" points. You need "+(Player.calcNexLevelExp()-Player.experience)+" to reach the next level."},health:function(){return"You have "+(Player.healthTotal/Player.healthMax*100).toFixed(0)+"% health"},armor:function(){return"Reduces damage taken to "+(100*Player.damageReduction).toFixed(2)+"%"},quickness:function(){return""+Player.quicknessProc+"% chance to critical hit and dodge"},damage:function(){var e,t=Player.equippedWeapon;e=t?(t.damage[0]+t.damage[1])/2:1;var o=e+Player.quicknessProc/100*e,n=t.effect&&"ItemProc"===t.effect.constructor.name;if(n){var a=t.effect.chance/100,r=t.effect.amt;o+=a*r}return""+o.toFixed(2)+" average total damage per hit"},toughness:function(){return"Increases armor and max health by "+Player.toughness}},renderStatDescription:function(){var e=this.getAttribute("data-stat"),t=UI.itemDescription.getStatDescriptions[e](),o=UI.itemDescription.createEl(t,"stat");UI.itemDescription.items.innerHTML="",UI.itemDescription.items.innerHTML=colorize(e,UI.colors.green),UI.itemDescription.items.appendChild(o),UI.itemDescription.showItemDescription()},bindEvents:function(e){e.onmouseenter=UI.itemDescription.renderItemDescription,e.onmousemove=UI.itemDescription.position,e.onmouseleave=UI.itemDescription.hideItemDescription},bindStatEvents:function(){bindToMany("[data-stat]","onmouseenter",this.renderStatDescription),bindToMany("[data-stat]","onmousemove",this.position),bindToMany("[data-stat]","onmouseleave",this.hideItemDescription)}},combatLog:{el:document.getElementById("combatLog"),renderCombatLog:function(e){var t=document.createElement("p");t.innerHTML=e,this.el.appendChild(t),UI.scrollToBottom(document.querySelector(".combat-log-container"))},renderItemTransaction:function(e,t,o){this.renderCombatLog(colorize("You",UI.colors.player)+" "+o+" "+e+" for "+colorize(t+" gold",UI.colors.gold)+".")},renderCannotPurchaseMessage:function(e,t){this.renderCombatLog(colorize("You",UI.colors.player)+" need "+colorize(t-Player.gold+" gold",UI.colors.gold)+" to buy "+e+".")},renderLootMessage:function(e){var t=GameState.currentMoment.enemy,o=e,n=o.length>0,a=1===o.length,r,i,s;if(r=t?" defeated "+colorize(t,"#fff"):"",n)if(i=" found",a){var l=o[0];i+=" "+colorize(l.name,UI.colors[l.rarity])}else forEach(o,function(e){i+=o.indexOf(e)<o.length-1?" "+colorize(e.name,UI.colors[e.rarity])+",":" and "+colorize(e.name,UI.colors[e.rarity])});else i="";s=t&&n?" and":"",this.renderCombatLog(colorize("You",UI.colors.player)+r+s+i+".")}},combat:{renderHealthBar:function(){var e=document.createElement("div");e.classList.add("health-bar"),UI.combatLog.el.appendChild(e)},updateHealthBar:function(){var e=document.querySelector(".health-bar"),t=(Player.healthTotal/Player.healthMax).toFixed(2),o=100-100*t;e.style.background="linear-gradient(to bottom, #1e5799 "+o+"% ,#1e5799 "+o+"% ,"+colorHealth(t)+" "+o+"%)"}},scrollToBottom:function(e){e.scrollTop=e.scrollHeight},reset:function(){this.combatLog.el.innerHTML="",this.inventory.el.innerHTML="",UI.statlist.renderStats()}},Combat={fighting:!0,rounds:0,generateEnemy:function(){var e=getObj(Enemies,GameState.currentMoment.enemy),t="Enemy"===e.constructor.name?buildNormalEnemy(e.name,e.level):buildCustomEnemy(e.name,e.level,e.healthTotal,e.equippedWeapon.name,e.armor,e.quicknessProc);t.healthMax=t.healthTotal,Combat.enemy=t},playerWins:function(){Combat.fighting=!1,Player.pickUpLoot(),Player.pickUpGold(),Combat.awardExperience(),GameState.setCurrentMoment(Moments["moment"+GameState.currentMoment.link])},playerLoses:function(){Combat.fighting=!1,UI.combatLog.renderCombatLog(""+colorize("You",UI.colors.player)+" were slain by "+colorize(Combat.enemy.name,"#fff")),Player.updateStats(),GameState.setCurrentMoment(Moments.playerLost)},awardExperience:function(){var e=this.rounds+15*Combat.enemy.level;Player.updateExperience(e);var t=Player.experience>Player.calcNexLevelExp();t&&Player.levelUp()},fight:function(e){var t,o,n=Combat.enemy;e%2?(t=n,o=Player):(t=Player,o=n),t.healthTotal>0?t.attack(o):t===n?Combat.playerWins():Combat.playerLoses()},runCombat:function(){var e,t=0;Combat.generateEnemy(),UI.combatLog.renderCombatLog(colorize("You engage "+Combat.enemy.name,UI.colors.red)),e=setInterval(function(){Combat.fighting?(t++,Combat.fight(t)):(clearInterval(e),Combat.fighting=!0,Combat.rounds=t)},700)}},Effects={buffs:{statBuff:function(e,t,o){this.amt=e,this.stats=t,this.description=o},toughness:function(e){return new Effects.buffs.statBuff(e,["toughness","healthTotal","healthMax","armor"],"Toughness +"+e)},quickness:function(e){return new Effects.buffs.statBuff(e,["quickness"],"Quickness +"+e)},weaponDamage:function(e,t){var o="min"===t?0:1,n=new Effects.buffs.statBuff(e,o,"Increase your equipped weapons's "+t+" damage by "+e);return n.run=function(){var t;Player.equippedWeapon?(Player.equippedWeapon.damage[o]+=this.amt,t="Your "+colorize(Player.equippedWeapon.name,UI.colors[Player.equippedWeapon.rarity])+"'s max attack is increased by "+e):t="You need to equip a weapon to use this",UI.combatLog.renderCombatLog(t)},n}},debuffs:{},heals:{heal:function(e){this.amt=e,this.description="Restore "+e+" hp",this.logMessage=colorize("You",UI.colors.player)+" are "+colorize("healed",UI.colors.green)+" for "+colorize(e,UI.colors.green)},healPlayer:function(e){return new Effects.heals.heal(e)}},quest:{},procs:{itemProc:function(e,t,o){this.amt=e,this.chance=t,this.description=o},weaponDamage:function(e,t){var o=new Effects.procs.itemProc(e,t,t+"% chance to deal "+e+" damage");return o.run=function(){var e=roll(0,100);return t>=e?!0:void 0},o},mirrorDamage:function(e,t){var o=new Effects.procs.itemProc(e,t,t+"% chance to reflect damage");return o.run=function(){var e=roll(0,100);return t>=e?!0:void 0},o}}};Effects.buffs.statBuff.prototype.run=function(){var e=this.amt;forEach(this.stats,function(t){Player[t]+=e})},Effects.buffs.statBuff.prototype.remove=function(){for(var e=0;e<this.stats.length;e++)Player[this.stats[e]]-=this.amt},Effects.heals.heal.prototype.run=function(){var e=Player.healthMax-Player.healthTotal;this.amt<=e?Player.healthTotal+=this.amt:Player.healthTotal+=e,UI.combatLog.renderCombatLog(this.logMessage)};var QuestEffect=function(e,t){this.description=e,this.content=t};QuestEffect.prototype.run=function(){UI.combatLog.renderCombatLog(this.content)};var Items={weapons:[],armor:[],consumables:[],all:[]},Pricing={rarities:{none:.5,common:1,rare:1.5,epic:2,legendary:3,set:3},types:{weapon:1,armor:.6,consumable:.3}},Item=function(e,t,o,n){this.name=e,this.level=t,this.rarity=o,this.flavorText=n};Item.prototype.use=function(){if(this.hasOwnProperty("effect")){for(var e=0;e<this.effect.length;e++)this.effect[e].run();Player.updateStats()}},Item.prototype.desc=function(){return this.effect.desc()},Item.prototype.getRarityMultiplier=function(){return Pricing.rarities[this.rarity]*Pricing.types[this.itemType]},Item.prototype.getSalePrice=function(){return 10*this.level*this.getRarityMultiplier().toFixed(0)},Item.prototype.getPurchasePrice=function(){return 10*this.level*this.getRarityMultiplier()+5*this.level};var Weapon=function(e,t,o,n,a,r){var i=new Item(e,t,o,n);return i.damage=a,i.itemType="weapon",r&&(i.effect=r),i},Armor=function(e,t,o,n,a,r,i){var s=new Item(e,t,o,n);return s.slot=a,s.armorAmt=r,s.itemType="armor",i&&(s.effect=i),s},Consumable=function(e,t,o,n,a){var r=new Item(e,t,o,n);return r.effect=a,r.itemType="consumable",r},buildItems=function(){forEach(items,function(e){Enemies.push(new Enemy(e[0],e[1]))})};Items.weapons.push(new Weapon("Foam Sword",0,"none","Just for fun",[0,0]),new Weapon("Muddy Hatchet",1,"none","",[1,3]),new Weapon("Rusty Short Sword",1,"none","",[2,4]),new Weapon("Dull Axe",1,"none","",[1,5]),new Weapon("Wooden Staff",1,"none","",[2,3]),new Weapon("Bent Spear",1,"none","",[1,4]),new Weapon("Iron Dagger",1,"common","",[3,4]),new Weapon("Short Spear",1,"common","",[1,6]),new Weapon("Blacksmith Hammer",1,"common","",[2,5]),new Weapon("Bronze Short Sword",1,"common","",[3,4]),new Weapon("Rusty Battle Axe",2,"none","",[1,6]),new Weapon("Oak Club",2,"none","",[2,5]),new Weapon("Old Longsword",2,"none","",[3,4]),new Weapon("Logging Axe",2,"none","",[2,6]),new Weapon("Bronze Spear",2,"common","",[1,8]),new Weapon("Balanced Dagger",2,"rare","",[3,5],[Effects.buffs.quickness(1)]),new Weapon("Fang Claws",2,"common","",[2,7]),new Weapon("Iron Short Sword",2,"common","",[3,6]),new Weapon("Wind Blade",3,"rare","",[4,9],[Effects.procs.weaponDamage(2,15)]),new Weapon("Double Edged Katana",10,"epic","",[5,7],[Effects.procs.weaponDamage(5,10)]),new Weapon("Sadams Golden AK-47",20,"legendary","Complete with incendiary rounds",[77,133],[Effects.procs.weaponDamage(33,20)]),new Weapon("P-70 Stealthhawk",8,"epic","",[17,25],[Effects.buffs.quickness(8)]),new Weapon("Heartsbane",10,"legendary","A real heartbreaker",[7,13],[Effects.buffs.quickness(7),Effects.procs.weaponDamage(100,5)]),new Weapon("Kusanagi the Grass Cutter",30,"set","Previously known as Sword of the Gathering Clouds of Heaven",[123,244],[Effects.buffs.toughness(20),Effects.buffs.quickness(35),Effects.procs.weaponDamage(50,15)])),Items.armor.push(new Armor("Wool Shirt",1,"none","","chest",2),new Armor("Twine Cinch",1,"none","","belt",1),new Armor("Ragged Trousers",1,"none","","pants",1),new Armor("Damp Boots",1,"none","","boots",1),new Armor("Linen Shirt",1,"rare","","chest",2,[Effects.buffs.quickness(1)]),new Armor("Leather Belt",1,"common","","belt",2),new Armor("Wool Cap",1,"common","","head",2),new Armor("Old Cloak",1,"common","","back",2),new Armor("Leather Sandals",1,"none","","boots",2),new Armor("Wool Sash",2,"none","","belt",2),new Armor("Old Canvas Pants",2,"none","","pants",2),new Armor("Skull Cap",2,"none","","head",2),new Armor("Thick Wool Shirt",2,"common","","chest",4),new Armor("Thick Leather Belt",2,"common","","belt",3),new Armor("Leather Hat",2,"common","","head",3),new Armor("Wool Cloak",2,"common","","back",3),new Armor("Travelers Boots",2,"common","","boots",3),new Armor("Centurian Cask",8,"epic","","head",18,[Effects.buffs.toughness(6),Effects.buffs.quickness(6)]),new Armor("Yata no Kagami",30,"set","","back",90,[Effects.buffs.toughness(40),Effects.procs.mirrorDamage(2,20)]),new Armor("Arturus Tabard",10,"legendary","This belonged to a true badass.","chest",50,[Effects.buffs.toughness(10),Effects.buffs.quickness(10)])),Items.consumables.push(new Consumable("Chicken Egg",1,"none","",[Effects.heals.healPlayer(4)]),new Consumable("Peasant Bread",1,"none","",[Effects.heals.healPlayer(5)]),new Consumable("Jerky",1,"common","",[Effects.heals.healPlayer(6)]),new Consumable("Dried Trout",2,"none","",[Effects.heals.healPlayer(8)]),new Consumable("Sharpsword Oil",2,"rare","",[Effects.buffs.weaponDamage(2,"max")]),new Consumable("Whetstone",2,"common","",[Effects.buffs.weaponDamage(1,"min")]));var QuestItem=function(e,t,o,n){this.name=e,this.itemType="quest",this.rarity=t,this.flavorText=o,this.use=Item.prototype.use,this.effect=n};Items.all=Items.weapons.concat(Items.armor,Items.consumables),Items.all.push(new QuestItem("Message","epic",'The cover says: "To be delivered to Jawn Peteron"',[new QuestEffect("Click to read",'It reads "There used to be a graying tower alone on the sea." That\'s the opening lyric to Seal\'s "Kiss from a Rose." Curious.')]));var Enemies=[],Enemy=function(e,t){this.name=e,this.level=t,this.healthTotal=10+(4*(t-1)+1),this.armor=4*(t-1)+1,this.quicknessProc=5,this.equippedWeapon=getRandomLootByLevel("weapons",t),this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)},CustomEnemy=function(e,t,o,n,a,r){this.name=e,this.level=t,this.healthTotal=o,this.armor=a,this.quicknessProc=r,this.equippedWeapon=getObj(Items.weapons,n),this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)};Enemy.prototype.getBaseDamage=function(){return this.equippedWeapon?roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]):roll(0,3)},CustomEnemy.prototype.getBaseDamage=function(){return this.equippedWeapon?roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]):roll(0,3)},Enemy.prototype.attack=function(e){Player.attack.call(this,e)},CustomEnemy.prototype.attack=function(e){Player.attack.call(this,e)},Enemy.prototype.rollQuicknessProc=function(){return roll(0,100)<=this.quicknessProc?!0:!1},CustomEnemy.prototype.rollQuicknessProc=function(){return roll(0,100)<=this.quicknessProc?!0:!1};var enemies=[["Vagrant Ranger",1],["Gray Wolf",1],["Derranged Lunatic",1],["Highway Bandit",1],["Wandering Looter",1],["Cloaked Assassin",1],["Town Guard",2],["Black Wolf",2]],customEnemies=[["Sinclair Graves",4,40,"Wind Blade",10,5],["Target Dummy",2,1e3,"Foam Sword",1,0],["Volkswain the Unmarred",10,400,"Wind Blade",20,15]],buildNormalEnemy=function(e,t){return new Enemy(e,t)},buildCustomEnemy=function(e,t,o,n,a,r){return new CustomEnemy(e,t,o,n,a,r)},buildEnemies=function(){var e=enemies.concat(customEnemies);forEach(e,function(e){e.length>2?Enemies.push(buildCustomEnemy.apply(null,e)):Enemies.push(buildNormalEnemy.apply(null,e))})};buildEnemies();var Tut={currentTut:{name:"",index:0},tuts:{equip:[{el:".inventory-list li",message:"This is a weapon. Click on it to equip.",tutEvent:"onclick"},{el:"#stat-list",message:"These are your stats. They define the power of your character. You can see that your damage has increased from the weapon.",tutEvent:"onmouseleave"}]},initTut:function(e){Tut.currentTut.name=e,Tut.renderTut(Tut.tuts[e][Tut.currentTut.index])},renderTut:function(e){var t=document.createElement("div"),o=document.createTextNode(e.message),n=document.querySelector(e.el),a=n.getBoundingClientRect(),r=n[e.tutEvent];t.appendChild(o),t.id="Tut",t.classList="tutorial-tip",t.style.top=a.top+15+"px",t.style.left=a.left+"px";var i=function(){null!==r?(r.call(n,arguments),Tut.nextTut.call(Tut,e,n,r)):Tut.nextTut.call(Tut,e,n,r)};n[e.tutEvent]=i,document.body.appendChild(t)},nextTut:function(e,t,o){void 0!==o?t[e.tutEvent]=o:t.removeEventListener(e.tutEvent),document.getElementById("Tut").remove();var n=Tut.tuts[Tut.currentTut.name].length>1,a=Tut.currentTut.index!==Tut.tuts[Tut.currentTut.name].length;n&&a&&(Tut.currentTut.index++,Tut.renderTut(Tut.tuts[Tut.currentTut.name][Tut.currentTut.index]))}},Moments={moment0:{message:"You're dreaming you're in a small boat. The black water around you stirs.",choices:[{message:"Wake up",link:1}],onLoad:function(){Player.reset(),UI.reset()}},moment1:{message:"You are suddenly conscious, and remember nothing.",choices:[{message:"Blink",link:2}]},moment2:{message:"You are standing in a dark woods.",choices:[{message:"Check your belongings",link:4},{message:"Look around",link:3}]},moment3:{message:"The sun has just set. You are surrounded by trees bathed in twilight.",choices:[{message:"Check your belongings",link:4},{message:"Start walking",link:5}]},moment4:{message:"Looped to your belt you find a weapon. Click on it in your inventory to equip it.",choices:[{message:"Start Walking",link:5}],dropLoot:[["weapons",1]],onLoad:function(){Tut.initTut("equip")}},moment5:{message:"You walk until you see a glowing light spidering through the trees.",choices:[{message:"Take a closer look",link:6},{message:"Continue on",link:9}]},moment6:{message:"From behind a tree you see a hunter stoking a fire. With him is a man tied up, slumped at the base of a tree.",choices:[{message:"Fight",link:8},{message:"Continue on",link:9}]},moment8:{message:"You draw your weapon and charge.",enemy:"Vagrant Ranger",dropLoot:[["armor",1],"Chicken Egg"],link:10},moment9:{message:"You find a road and begin walking west. Up ahead you see a figure on horseback galloping towards you.",choices:[{message:"Keep walking",link:14},{message:"Hide",link:15}]},moment10:{message:"After taking a minute to recover, you turn to the captured man. You're damaged. Try clicking on the chicken egg to heal yourself.",choices:[{message:'"Where am I?"',link:12},{message:"Take a closer look",link:12}]},moment12:{message:"As you lean in to check if the man is alive, he suddenly lunges at you.",enemy:"Derranged Lunatic",dropLoot:[["armor",1],"Message"],link:13},moment13:{message:"You notice a lockbox on the ground near the fire.",choices:[{message:"Check it out",link:"13a"},{message:"Continue on",link:9}]},moment13a:{message:"There's nothing else here.",choices:[{message:"Continue on",link:9}],dropLoot:[["all",1],["consumables",1]]},moment14:{message:"As the man gets closer, he draws a sword.",choices:[{message:"Fight",link:16},{message:"Hide",link:15}]},moment15:{message:"You run into the trees until you cannot see the road. You hear the figure pass. Ahead of you is a ruined mill.",choices:[{message:"Check out the mill",link:17},{message:"Go back to the road",link:18}]},moment16:{message:"You draw your weapon and stand your ground.",enemy:"Highway Bandit",dropLoot:[["all",1]],link:18},moment17:{message:"You approach the shoddy old mill until you can hear voices coming from inside.",choices:[{message:"Take a peek",link:"17b"},{message:"Bust in there",link:"17b"},{message:"Go back to the road",link:18}]},moment17b:{message:'"Who the fuck are you?" says Sinclair Black, a notable thief.',choices:[{message:'"Your mom"',link:"17c"},{message:"Punch him in the face",link:"17c"},{message:"Run away",link:18}]},moment17c:{message:'"You bitch, I will end you."',enemy:"Sinclair Graves",dropLoot:["Wind Blade","Jerky"],link:18},moment18:{message:"You walk for miles until you see a steeple poking up from the treeline ahead. It seems you found a town.",choices:[{message:"Look around",link:19},{message:"Talk to someone",link:20}]},moment19:{message:"You walk to the town square and look around. Where would you like to go?",choices:[{message:"The Arms Shop",link:20},{message:"The General Store",link:21},{message:"The Inn",link:22
},{message:"The Town Hall",link:24}]},moment20:{message:'You enter the arms shop. "Ahoy there traveler," says the owner. "What can I do for you?"',shop:[["weapons",1],["weapons",1],["weapons",2],["armor",1],["armor",2]],choices:[{message:"Leave the shop",link:19}]},moment21:{message:'You enter the general store. "Hey baby," says the clerk. "What can I help you with?"',shop:[["consumables",1],["consumables",1],["consumables",2],["consumables",2]],choices:[{message:"Leave the shop",link:19}]},moment22:{message:'You enter the inn. "Sup playa," says the innkeeper. "Would you like a room? Its 2 gold for the night."',choices:[{message:"Yes please",link:23},{message:"No thanks",link:19}]},moment23:{message:"You go up to your room and sleep off your wounds. You wake up feeling like a million bucks.",inn:2,choices:[{message:"Leave the inn",link:19},{message:"Get another room",link:23}]},moment24:{message:"You stand in the large chamber of the Town Hall. Merchants and town leaders are assembled in discussion.",choices:[{message:"Leave the hall",link:19},{message:"Look around",link:26},{message:"Ask for Jawn Peterson",link:26},{message:"Talk to the tenant-in-chief",link:27}]},moment26:{message:'You approach a man writing at a desk near the entrance. "Do you know a man who goes by Jawn Peterson?" you ask. "The man points to two men standing near a side entrance."',choices:[{message:"Go over",link:27},{message:"Do something else",link:24}]},moment27:{message:'The men spot you approaching. "Are you Jawn Peterson? you ask." He seems to look you over until replying "Yes I am. Would you like to join me for a drink? You look like you could use it."',choices:[{message:"Go with him",link:28},{message:"Do something else",link:24}]},moment28:{message:"You walk outside and turn the corner. The cloaked man with Jawn Peterson suddenly pulls a dagger on you and attacks.",enemy:"Cloaked Assassin",dropLoot:[["all",2]],link:24},playerLost:{message:"You were killed. Sorry.",choices:[{message:"Start over",link:0}]}};Player.updateStats(),Player.updateGold(0),UI.itemDescription.bindStatEvents();
//# sourceMappingURL=./app-min.js.map