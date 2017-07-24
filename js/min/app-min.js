"use strict";var colorize=function e(t,o){return'<span style="color: '+o+';">'+t+"</span>"},roll=function e(t,o){return Math.floor(Math.random()*(o-t+1))+t},getObj=function e(t,o){var n=t.filter(function(e){return e.name===o});return n?n[0]:null},getFromArr=function e(t,o){var n=t.filter(function(e){return e.slot===o});return n?n[0]:null},removeFromArr=function e(t,o){var n=t.indexOf(o);n>-1&&t.splice(n,1)},getObjLvl=function e(t,o){for(var n=[],a=0;a<t.length;a++)t[a].level===o&&n.push(t[a]);return n},forEach=function e(t,o){for(var n=0;n<t.length;n++)o(t[n])},forEachMethod=function e(t,o){for(var n=0;n<t.length;n++)t[n][o]()},bindToMany=function e(t,o,n){for(var a=document.querySelectorAll(t),r=0;r<a.length;r++)a[r][o]=n},getName=function e(t){return t.name},map=function e(t,o){var n=[];return forEach(t,function(e){n.push(o(e))}),n},getRandomLootByLevel=function e(t,o){var n=getObjLvl(Items[t],o);return n[roll(0,n.length-1)]},colorHealth=function e(t){var o=[35,250,136],n=[255,104,57],a=o[0],r=o[1],i=o[2];return a+=(n[0]-o[0])*(1-t),r-=(o[1]-n[1])*(1-t),i+=(n[2]-o[2])*(1-t),"rgb("+a.toFixed(0)+", "+r.toFixed(0)+", "+i.toFixed(0)+")"},newTextElement=function e(t,o){var n=document.createElement(t),a=document.createTextNode(o);return n.appendChild(a),n},_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},GameState={currentMoment:"",setCurrentMoment:function e(t){this.currentMoment=t,UI.narrative.renderMoment(),this.checkForAndCreateChoices(),this.checkForAndPickUpLoot(),this.checkForAndRunCombat(),this.checkForAndOpenUpShop(),this.checkForAndRunInn(),this.checkForAndRunOnLoad(),UI.scrollToBottom(UI.narrative.el)},checkForAndRunOnLoad:function e(){this.currentMoment.hasOwnProperty("onLoad")&&this.currentMoment.onLoad()},processRandomLoot:function e(t){var o;return o="object"===(void 0===t?"undefined":_typeof(t))?getRandomLootByLevel(t[0],t[1]):getObj(Items.all,t)},checkForAndPickUpLoot:function e(){this.currentMoment.hasOwnProperty("dropLoot")&&!this.currentMoment.hasOwnProperty("enemy")&&Player.pickUpLoot()},checkForAndRunCombat:function e(){this.currentMoment.hasOwnProperty("enemy")&&Combat.runCombat()},checkForAndOpenUpShop:function e(){this.currentMoment.hasOwnProperty("shop")?(UI.narrative.renderShop(),this.bindShopItemEvents()):this.bindWorldItemEvents()},checkForAndRunInn:function e(){if(this.currentMoment.hasOwnProperty("inn")){var t=this.currentMoment.inn;Player.gold>=t?(Player.updateGold(-t),Player.healthTotal=Player.healthMax,Player.updateStats(),UI.combatLog.renderCombatLog(colorize("You",UI.colors.player)+" bought a room for "+colorize(t+" gold",UI.colors.gold)+"."),UI.combatLog.renderCombatLog(colorize("Your",UI.colors.player)+" health is "+colorize("fully restored",UI.colors.green))):UI.combatLog.renderCombatLog(colorize("You",UI.colors.player)+" need "+colorize(t-Player.gold,UI.colors.gold)+" to get a room.")}},checkForAndCreateChoices:function e(){this.currentMoment.hasOwnProperty("choices")&&UI.narrative.renderChoices()},bindWorldItemEvents:function e(){for(var t=UI.inventory.el.querySelectorAll("[data-item]"),o=0;o<t.length;o++)t[o].onclick=UI.inventory.activateItem},bindShopItemEvents:function e(){for(var t=UI.narrative.el.querySelectorAll("[data-item]"),o=UI.inventory.el.querySelectorAll("[data-item]"),n=0;n<t.length;n++)t[n].onclick=Player.purchaseItem;for(var a=0;a<o.length;a++)o[a].onclick=Player.sellItem},messages:{gainLvl:colorize("You gained a level! Your toughness and quickness have increased by 1.","yellow")}},Player={name:"You",level:1,healthMax:25,healthTotal:25,armor:0,toughness:0,quickness:1,equippedWeapon:"",equippedArmor:{head:"",chest:"",back:"",belt:"",pants:"",boots:""},inventory:[],gold:0,experience:0,levelUp:function e(){this.level=this.level+1,this.toughness=this.toughness+1,this.quickness=this.quickness+1,this.healthTotal=this.healthMax,this.updateStats(),UI.combatLog.renderCombatLog(GameState.messages.gainLvl)},calcNexLevelExp:function e(){for(var t=50,o=0;o<this.level;o++)t+=20*(o+1);return t},updateExperience:function e(t){this.experience=this.experience+t,UI.combatLog.renderCombatLog(colorize("You","#fff")+" gained "+colorize(t+" experience.","#fff"))},updateStats:function e(){this.setHealth(),this.setDamage(),this.setArmor(),this.setToughness(),this.setDamageReduction(),this.setQuicknessProc(),UI.statlist.renderStats()},updateGold:function e(t){this.gold+=t,UI.inventory.renderGold()},setHealth:function e(){this.health=this.healthTotal+"/"+this.healthMax},setArmor:function e(){this.armor=0;for(var t in this.equippedArmor)this.equippedArmor[t].armorAmt&&(this.armor+=this.equippedArmor[t].armorAmt);this.armor+=this.toughness},setDamage:function e(){this.equippedWeapon?this.damage=this.equippedWeapon.damage[0]+"-"+this.equippedWeapon.damage[1]:this.damage="0-2"},setDamageReduction:function e(){this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)},setToughness:function e(){this.healthMax=25+this.toughness},setQuicknessProc:function e(){this.quicknessProc=(.02*this.quickness/(1+.02*this.quickness)*100).toFixed(2)},getBaseDamage:function e(){return this.equippedWeapon?roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]):roll(0,3)},rollQuicknessProc:function e(){return roll(0,100)<=this.quicknessProc},attack:function e(t){var o=Math.round(this.getBaseDamage()*t.damageReduction),n,a,r="",i="hit",s="yellow",l=this.rollQuicknessProc(),c=t.rollQuicknessProc(),m;if(this.equippedWeapon.effect){var u=this.equippedWeapon.effect;n="itemProc"===u[u.length-1].constructor.name,a=u[u.length-1].run()}if(l&&(o*=2,i=""+colorize("critically hit",UI.colors.red),s=UI.colors.red),n&&a){var h=u[u.length-1],d;d="You"===this.name?"Your":this.name+"'s",t.healthTotal-=h.amt,r=" and "+colorize(this.equippedWeapon.name,UI.colors[this.equippedWeapon.rarity])+" hits for "+colorize(h.amt,"yellow")}c?UI.combatLog.renderCombatLog(colorize(t.healthTotal,colorHealth(t.healthTotal/t.healthMax))+" "+colorize(t.name,UI.colors.entity)+" "+colorize("dodged","yellow")+" "+colorize(this.name,UI.colors.entity)+" for 0"):(t.healthTotal-=o,m=colorize(this.healthTotal,colorHealth(this.healthTotal/this.healthMax))+" "+colorize(this.name,UI.colors.entity)+" "+i+" "+colorize(t.name,UI.colors.entity)+" for "+colorize(o,s),UI.combatLog.renderCombatLog(m+r)),Player.updateStats()},pickUpGold:function e(){var t=getObj(Enemies,GameState.currentMoment.enemy).level,o=roll(4,8)*t;Player.updateGold(o),UI.combatLog.renderCombatLog(colorize("You",UI.colors.player)+" found "+colorize(o+" gold.",UI.colors.gold))},pickUpLoot:function e(){var t=map(GameState.currentMoment.dropLoot,GameState.processRandomLoot);forEach(t,Player.addToInventory),UI.combatLog.renderLootMessage(t)},addToInventory:function e(t){Player.inventory.push(t),UI.inventory.renderInventoryItem(t)},removeFromInventory:function e(t,o){removeFromArr(this.inventory,t),UI.inventory.removeInventoryItem(o)},equipWeapon:function e(t){this.equippedWeapon&&this.unequipCurrentWeapon(),this.equippedWeapon=t,this.updateStats()},equipArmor:function e(t){this.equippedArmor[t.slot]&&Player.unequipArmor(this.equippedArmor[t.slot]),this.equippedArmor[t.slot]=t,this.updateStats()},unequipArmor:function e(t){this.equippedArmor[t.slot]="",t.effect&&forEachMethod(t.effect,"remove")},removeWepBuff:function e(t){!0==("statBuff"===t.constructor.name)&&t.remove()},unequipCurrentWeapon:function e(){var t=this.equippedWeapon;t.effect&&forEach(t.effect,this.removeWepBuff),t&&(t="")},purchaseItem:function e(){var t=this.getAttribute("data-item"),o=getObj(Items.all,t);Player.gold>=o.getPurchasePrice()?(Player.updateGold(-o.getPurchasePrice()),Player.addToInventory(o),UI.combatLog.renderItemTransaction(colorize(o.name,UI.colors[o.rarity]),o.getPurchasePrice(),"bought")):UI.combatLog.renderCannotPurchaseMessage(colorize(o.name,UI.colors[o.rarity]),o.getPurchasePrice())},sellItem:function e(){var t=this.getAttribute("data-item"),o=getObj(Items.all,t);Player.updateGold(o.getSalePrice()),o===Player.equippedWeapon&&Player.unequipCurrentWeapon(),o===Player.equippedArmor[o.slot]&&Player.unequipArmor(o),Player.removeFromInventory(o,this),Player.updateStats(),UI.itemDescription.hideItemDescription(),UI.combatLog.renderItemTransaction(colorize(o.name,UI.colors[o.rarity]),o.getSalePrice(),"sold")},reset:function e(){this.name="You",this.level=1,this.healthMax=25,this.healthTotal=25,this.armor=0,this.toughness=0,this.quickness=1,this.equippedWeapon="",this.equippedArmor={head:"",chest:"",back:"",belt:"",pants:"",boots:""},this.inventory=[],this.gold=0,this.experience=0,Player.updateStats(),Player.updateGold(0)}},UI={colors:{none:"#939DBD",common:"#fff",rare:"#0047FF",epic:"#9E65C4",legendary:"#C6AF66",set:"#32cbb4",entity:"#fff",player:"#fff",enemy:"#fff",gold:"#E5CA48",red:"#ff6839",green:"#23fa88"},narrative:{el:document.getElementById("narrative"),getMomentByClick:function e(){var t=this.getAttribute("data-moment");GameState.setCurrentMoment(Moments["moment"+t])},renderShopItem:function e(t){var o=document.createElement("a"),n=document.createTextNode(t.name);o.setAttribute("data-item",t.name),UI.itemDescription.bindEvents(o),o.appendChild(n),UI.narrative.el.appendChild(o),o.onclick=Player.purchaseItem},renderShop:function e(){var t=map(GameState.currentMoment.shop,GameState.processRandomLoot);forEach(t,UI.narrative.renderShopItem),bindToMany("#inventory [data-item]","onclick",Player.sellItem)},renderChoice:function e(t){var o=document.createElement("a"),n=document.createTextNode(t.message);o.setAttribute("data-moment",t.link),o.appendChild(n),o.onclick=UI.narrative.getMomentByClick,UI.narrative.el.appendChild(o)},renderChoices:function e(){var t=GameState.currentMoment.choices;forEach(t,UI.narrative.renderChoice)},renderMoment:function e(){UI.narrative.el.innerHTML="";var t=document.createElement("p"),o=document.createTextNode(GameState.currentMoment.message);t.appendChild(o),UI.narrative.el.appendChild(t)}},statlist:{el:document.getElementById("stat-list"),renderStat:function e(t){var o=t.parentNode.getAttribute("data-stat");t.innerHTML=Player[o]},renderStats:function e(){var t=this.el.querySelectorAll("div");forEach(t,this.renderStat)}},inventory:{el:document.getElementById("inventory"),gold:document.getElementById("gold"),renderInventoryItem:function e(t){var o=document.createElement("li"),n=document.createTextNode(t.name),a=GameState.currentMoment.hasOwnProperty("shop"),r="armor"===t.itemType&&t===Player.equippedArmor[t.slot],i=Player.equippedWeapon&&t===Player.equippedWeapon;o.appendChild(n),o.setAttribute("data-item",t.name),UI.itemDescription.bindEvents(o),UI.inventory.el.appendChild(o),a?GameState.bindShopItemEvents():GameState.bindWorldItemEvents(),i&&UI.inventory.renderEquippedWeapon(o),r&&o.classList.add("equipped-armor")},removeInventoryItem:function e(t){t.remove()},renderInventory:function e(){this.el.innerHTML="",forEach(Player.inventory,this.renderInventoryItem)},renderGold:function e(){UI.inventory.gold.innerHTML=Player.gold},removeEquippedWepTag:function e(){var t=document.querySelector(".equipped-wep");t&&t.classList.remove("equipped-wep")},removeEquippedArmorTag:function e(){for(var t=document.querySelectorAll(".equipped-armor"),o=0;o<t.length;o++)t[o].classList.remove("equipped-armor")},renderEquippedWeapon:function e(t){this.removeEquippedWepTag(),t.classList.add("equipped-wep")},renderEquippedArmor:function e(){this.removeEquippedArmorTag();for(var t in Player.equippedArmor)Player.equippedArmor[t].name&&UI.inventory.el.querySelector('[data-item="'+Player.equippedArmor[t].name+'"').classList.add("equipped-armor")},activateItem:function e(){var t=this.getAttribute("data-item"),o=getObj(Items.all,t);Player.equippedWeapon!==o&&o!==Player.equippedArmor[o.slot]&&("weapon"===o.itemType?(Player.equipWeapon(o),UI.inventory.renderEquippedWeapon(this),o.use()):"armor"===o.itemType&&(Player.equipArmor(o),UI.inventory.renderEquippedArmor(),o.use())),"consumable"===o.itemType&&(Player.removeFromInventory(o,this),UI.itemDescription.hideItemDescription(),o.use()),"quest"===o.itemType&&o.use()}},itemDescription:{el:document.getElementById("itemDescription"),items:document.getElementById("descItems"),initialX:0,initialY:0,getInitialY:function e(t){var o=t.pageY;return UI.itemDescription.intialY=o,o},getInitialX:function e(t){var o=t.pageX;return UI.itemDescription.intialX=o,o},position:function e(t){var o=UI.itemDescription,n=window.innerWidth,a=window.innerHeight,r=o.getInitialX(t),i=o.getInitialY(t),s="translate3d("+r+"px,"+i+"px, 0)";t.pageX+(o.el.offsetWidth+10)>n?o.el.style.left=o.initialX-o.el.offsetWidth-10+"px":o.el.style.left=o.initialX+10+"px",t.pageY+(o.el.offsetHeight+10)>a?o.el.style.top=o.initialY-o.el.offsetHeight-10+"px":UI.itemDescription.el.style.top=o.initialY+10+"px",o.el.style.webkitTransform=s,o.el.style.transform=s},showItemDescription:function e(){UI.itemDescription.el.style.display="block"},hideItemDescription:function e(){UI.itemDescription.el.style.display="none"},createEl:function e(t,o){var n=document.createElement("div"),a=document.createTextNode(t);return n.classList.add(o),n.appendChild(a),n},renderItemDescription:function e(){UI.itemDescription.items.innerHTML="";var t=this.getAttribute("data-item"),o=getObj(Items.all,t),n;for(var a in o)if("function"!=typeof o[a]){if(n="damage"===a?UI.itemDescription.createEl(o[a][0]+"-"+o[a][1],""+a):UI.itemDescription.createEl(o[a],""+a),"effect"===a){n=UI.itemDescription.createEl(o[a].description,""+a);for(var r=0;r<o.effect.length;r++)n=UI.itemDescription.createEl(o[a][r].description,""+a),UI.itemDescription.items.appendChild(n)}"rarity"===a&&(document.querySelector(".name").style.color=UI.colors[o[a]]),"flavorText"===a&&""===o[a]||UI.itemDescription.items.appendChild(n)}else if("getSalePrice"===a&&this.parentNode===UI.inventory.el){if(n=UI.itemDescription.createEl(o[a](),""+a),UI.itemDescription.items.appendChild(n),GameState.currentMoment.hasOwnProperty("shop")){var i=UI.itemDescription.createEl("(Click to sell)","shop-item");UI.itemDescription.items.appendChild(i)}}else if("getPurchasePrice"===a&&this.parentNode===UI.narrative.el&&(n=UI.itemDescription.createEl(o[a](),""+a),UI.itemDescription.items.appendChild(n),GameState.currentMoment.hasOwnProperty("shop"))){var s=UI.itemDescription.createEl("(Click to buy)","shop-item");UI.itemDescription.items.appendChild(s)}UI.itemDescription.showItemDescription()},getStatDescriptions:{wep:Player.equippedWeapon,level:function e(){return"You have "+Player.experience+" experience points. You need "+(Player.calcNexLevelExp()-Player.experience)+" to reach the next level."},health:function e(){return"You have "+(Player.healthTotal/Player.healthMax*100).toFixed(0)+"% health"},armor:function e(){return"Reduces damage taken to "+(100*Player.damageReduction).toFixed(2)+"%"},quickness:function e(){return Player.quicknessProc+"% chance to critical hit and dodge"},damage:function e(){var t,o=Player.equippedWeapon;t=o?(o.damage[0]+o.damage[1])/2:1;var n=t+Player.quicknessProc/100*t;o.effect&&"ItemProc"===o.effect.constructor.name&&(n+=o.effect.chance/100*o.effect.amt);return n.toFixed(2)+" average total damage per hit"},toughness:function e(){return"Increases armor and max health by "+Player.toughness}},renderStatDescription:function e(){var t=this.getAttribute("data-stat"),o=UI.itemDescription.getStatDescriptions[t](),n=UI.itemDescription.createEl(o,"stat");n.classList.add("property-label"),UI.itemDescription.items.innerHTML="",UI.itemDescription.items.innerHTML=colorize(t,UI.colors.green),UI.itemDescription.items.appendChild(n),UI.itemDescription.showItemDescription()},bindEvents:function e(t){t.onmouseenter=UI.itemDescription.renderItemDescription,t.onmousemove=UI.itemDescription.position,t.onmouseleave=UI.itemDescription.hideItemDescription},bindStatEvents:function e(){bindToMany("[data-stat]","onmouseenter",this.renderStatDescription),bindToMany("[data-stat]","onmousemove",this.position),bindToMany("[data-stat]","onmouseleave",this.hideItemDescription)}},combatLog:{el:document.getElementById("combatLog"),renderCombatLog:function e(t){var o=document.createElement("p");o.innerHTML=t,this.el.appendChild(o),UI.scrollToBottom(document.querySelector(".combat-log-container"))},renderItemTransaction:function e(t,o,n){this.renderCombatLog(colorize("You",UI.colors.player)+" "+n+" "+t+" for "+colorize(o+" gold",UI.colors.gold)+".")},renderCannotPurchaseMessage:function e(t,o){this.renderCombatLog(colorize("You",UI.colors.player)+" need "+colorize(o-Player.gold+" gold",UI.colors.gold)+" to buy "+t+".")},renderLootMessage:function e(t){var o=GameState.currentMoment.enemy,n=t,a=n.length>0,r=1===n.length,i,s,l;if(i=o?" defeated "+colorize(o,"#fff"):"",a)if(s=" found",r){var c=n[0];s+=" "+colorize(c.name,UI.colors[c.rarity])}else forEach(n,function(e){n.indexOf(e)<n.length-1?s+=" "+colorize(e.name,UI.colors[e.rarity])+",":s+=" and "+colorize(e.name,UI.colors[e.rarity])});else s="";l=o&&a?" and":"",this.renderCombatLog(colorize("You",UI.colors.player)+i+l+s+".")}},combat:{renderHealthBar:function e(){var t=document.createElement("div");t.classList.add("health-bar"),UI.combatLog.el.appendChild(t)},updateHealthBar:function e(){var t=document.querySelector(".health-bar"),o=(Player.healthTotal/Player.healthMax).toFixed(2),n=100-100*o;t.style.background="linear-gradient(to bottom, #1e5799 "+n+"% ,#1e5799 "+n+"% ,"+colorHealth(o)+" "+n+"%)"}},scrollToBottom:function e(t){t.scrollTop=t.scrollHeight},reset:function e(){this.combatLog.el.innerHTML="",this.inventory.el.innerHTML="",UI.statlist.renderStats()}},Combat={fighting:!0,rounds:0,generateEnemy:function e(){var t=getObj(Enemies,GameState.currentMoment.enemy),o="Enemy"===t.constructor.name?buildNormalEnemy(t.name,t.level):buildCustomEnemy(t.name,t.level,t.healthTotal,t.equippedWeapon.name,t.armor,t.quicknessProc);o.healthMax=o.healthTotal,Combat.enemy=o},playerWins:function e(){Combat.fighting=!1,Player.pickUpLoot(),Player.pickUpGold(),Combat.awardExperience(),GameState.setCurrentMoment(Moments["moment"+GameState.currentMoment.link])},playerLoses:function e(){Combat.fighting=!1,UI.combatLog.renderCombatLog(colorize("You",UI.colors.player)+" were slain by "+colorize(Combat.enemy.name,"#fff")),Player.updateStats(),GameState.setCurrentMoment(Moments.playerLost)},awardExperience:function e(){var t=this.rounds+15*Combat.enemy.level;Player.updateExperience(t),Player.experience>Player.calcNexLevelExp()&&Player.levelUp()},fight:function e(t){var o,n,a=Combat.enemy;t%2?(o=a,n=Player):(o=Player,n=a),o.healthTotal>0?o.attack(n):o===a?Combat.playerWins():Combat.playerLoses()},runCombat:function e(){var t,o=0;Combat.generateEnemy(),UI.combatLog.renderCombatLog(colorize(Combat.enemy.name+" attacks!",UI.colors.red)),t=setInterval(function(){Combat.fighting?(o++,Combat.fight(o)):(clearInterval(t),Combat.fighting=!0,Combat.rounds=o)},700)}},Effects={buffs:{statBuff:function e(t,o,n){this.amt=t,this.stats=o,this.description=n},toughness:function e(t){return new Effects.buffs.statBuff(t,["toughness","healthTotal","healthMax","armor"],"Toughness +"+t)},quickness:function e(t){return new Effects.buffs.statBuff(t,["quickness"],"Quickness +"+t)},weaponDamage:function e(t,o){var n="min"===o?0:1,a=new Effects.buffs.statBuff(t,n,"Increase your equipped weapons's "+o+" damage by "+t);return a.run=function(){var e;Player.equippedWeapon?(Player.equippedWeapon.damage[n]+=this.amt,e="Your "+colorize(Player.equippedWeapon.name,UI.colors[Player.equippedWeapon.rarity])+"'s max attack is increased by "+t):e="You need to equip a weapon to use this",UI.combatLog.renderCombatLog(e)},a}},debuffs:{},heals:{heal:function e(t){this.amt=t,this.description="Restore "+t+" hp",this.logMessage=colorize("You",UI.colors.player)+" are "+colorize("healed",UI.colors.green)+" for "+colorize(t,UI.colors.green)},healPlayer:function e(t){return new Effects.heals.heal(t)}},quest:{},procs:{itemProc:function e(t,o,n){this.amt=t,this.chance=o,this.description=n},weaponDamage:function e(t,o){var n=new Effects.procs.itemProc(t,o,o+"% chance to deal "+t+" damage");return n.run=function(){if(roll(0,100)<=o)return!0},n},mirrorDamage:function e(t,o){var n=new Effects.procs.itemProc(t,o,o+"% chance to reflect damage");return n.run=function(){if(roll(0,100)<=o)return!0},n}}};Effects.buffs.statBuff.prototype.run=function(){var e=this.amt;forEach(this.stats,function(t){Player[t]+=e})},Effects.buffs.statBuff.prototype.remove=function(){for(var e=0;e<this.stats.length;e++)Player[this.stats[e]]-=this.amt},Effects.heals.heal.prototype.run=function(){var e=Player.healthMax-Player.healthTotal;this.amt<=e?Player.healthTotal+=this.amt:Player.healthTotal+=e,UI.combatLog.renderCombatLog(this.logMessage)};var QuestEffect=function e(t,o){this.description=t,this.content=o};QuestEffect.prototype.run=function(){UI.combatLog.renderCombatLog(this.content)};var Items={weapons:[],armor:[],consumables:[],all:[]},Pricing={rarities:{none:.5,common:1,rare:1.5,epic:2,legendary:3,set:3},types:{weapon:1,armor:.6,consumable:.3}},Item=function e(t,o,n,a){this.name=t,this.level=o,this.rarity=n,this.flavorText=a};Item.prototype.use=function(){if(this.hasOwnProperty("effect")){for(var e=0;e<this.effect.length;e++)this.effect[e].run();Player.updateStats()}},Item.prototype.desc=function(){return this.effect.desc()},Item.prototype.getRarityMultiplier=function(){return Pricing.rarities[this.rarity]*Pricing.types[this.itemType]},Item.prototype.getSalePrice=function(){return 10*this.level*this.getRarityMultiplier().toFixed(1)},Item.prototype.getPurchasePrice=function(){return 10*this.level*this.getRarityMultiplier()+5*this.level};var Weapon=function e(t,o,n,a,r,i){var s=new Item(t,o,n,a);return s.damage=r,s.itemType="weapon",i&&(s.effect=i),s},Armor=function e(t,o,n,a,r,i,s){var l=new Item(t,o,n,a);return l.slot=r,l.armorAmt=i,l.itemType="armor",s&&(l.effect=s),l},Consumable=function e(t,o,n,a,r){var i=new Item(t,o,n,a);return i.effect=r,i.itemType="consumable",i},buildItems=function e(){forEach(items,function(e){Enemies.push(new Enemy(e[0],e[1]))})};Items.weapons.push(new Weapon("Foam Sword",0,"none","Just for fun",[0,0]),new Weapon("Muddy Hatchet",1,"none","",[1,3]),new Weapon("Rusty Short Sword",1,"none","",[2,4]),new Weapon("Dull Axe",1,"none","",[1,5]),new Weapon("Wooden Staff",1,"none","",[2,3]),new Weapon("Bent Spear",1,"none","",[1,4]),new Weapon("Iron Dagger",1,"common","",[3,4]),new Weapon("Short Spear",1,"common","",[1,6]),new Weapon("Blacksmith Hammer",1,"common","",[2,5]),new Weapon("Bronze Short Sword",1,"common","",[3,4]),new Weapon("Rusty Battle Axe",2,"none","",[1,6]),new Weapon("Oak Club",2,"none","",[2,5]),new Weapon("Old Longsword",2,"none","",[3,4]),new Weapon("Logging Axe",2,"none","",[2,6]),new Weapon("Bronze Spear",2,"common","",[1,8]),new Weapon("Balanced Dagger",2,"rare","",[3,5],[Effects.buffs.quickness(1)]),new Weapon("Fang Claws",2,"common","",[2,7]),new Weapon("Iron Short Sword",2,"common","",[3,6]),new Weapon("Wind Blade",3,"rare","",[4,9],[Effects.procs.weaponDamage(2,15)]),new Weapon("Double Edged Katana",10,"epic","",[5,7],[Effects.procs.weaponDamage(5,10)]),new Weapon("Sadams Golden AK-47",20,"legendary","Complete with incendiary rounds",[77,133],[Effects.procs.weaponDamage(33,20)]),new Weapon("P-70 Stealthhawk",8,"epic","",[17,25],[Effects.buffs.quickness(8)]),new Weapon("Heartsbane",10,"legendary","A real heartbreaker",[7,13],[Effects.buffs.quickness(7),Effects.procs.weaponDamage(100,5)]),new Weapon("Kusanagi the Grass Cutter",30,"set","Previously known as Sword of the Gathering Clouds of Heaven",[123,244],[Effects.buffs.toughness(20),Effects.buffs.quickness(35),Effects.procs.weaponDamage(50,15)])),Items.armor.push(new Armor("Wool Shirt",1,"none","","chest",2),new Armor("Twine Cinch",1,"none","","belt",1),new Armor("Ragged Trousers",1,"none","","pants",1),new Armor("Damp Boots",1,"none","","boots",1),new Armor("Linen Shirt",1,"rare","","chest",2,[Effects.buffs.quickness(1)]),new Armor("Leather Belt",1,"common","","belt",2),new Armor("Wool Cap",1,"common","","head",2),new Armor("Old Cloak",1,"common","","back",2),new Armor("Leather Sandals",1,"none","","boots",2),new Armor("Wool Sash",2,"none","","belt",2),new Armor("Old Canvas Pants",2,"none","","pants",2),new Armor("Skull Cap",2,"none","","head",2),new Armor("Thick Wool Shirt",2,"common","","chest",4),new Armor("Thick Leather Belt",2,"common","","belt",3),new Armor("Leather Hat",2,"common","","head",3),new Armor("Wool Cloak",2,"common","","back",3),new Armor("Travelers Boots",2,"common","","boots",3),new Armor("Centurian Cask",8,"epic","","head",18,[Effects.buffs.toughness(6),Effects.buffs.quickness(6)]),new Armor("Yata no Kagami",30,"set","","back",90,[Effects.buffs.toughness(40),Effects.procs.mirrorDamage(2,20)]),new Armor("Arturus Tabard",10,"legendary","This belonged to a true badass.","chest",50,[Effects.buffs.toughness(10),Effects.buffs.quickness(10)])),Items.consumables.push(new Consumable("Chicken Egg",1,"none","",[Effects.heals.healPlayer(4)]),new Consumable("Peasant Bread",1,"none","",[Effects.heals.healPlayer(5)]),new Consumable("Jerky",1,"common","",[Effects.heals.healPlayer(6)]),new Consumable("Dried Trout",2,"none","",[Effects.heals.healPlayer(8)]),new Consumable("Sharpsword Oil",2,"rare","",[Effects.buffs.weaponDamage(2,"max")]),new Consumable("Whetstone",2,"common","",[Effects.buffs.weaponDamage(1,"min")]));var QuestItem=function e(t,o,n,a){this.name=t,this.itemType="quest",this.rarity=o,this.flavorText=n,this.use=Item.prototype.use,this.effect=a};Items.all=Items.weapons.concat(Items.armor,Items.consumables),Items.all.push(new QuestItem("Message","epic",'The cover says: "To be delivered to Jon Peterson"',[new QuestEffect("Click to read",'It reads "There used to be a graying tower alone on the sea." That\'s the opening lyric to Seal\'s "Kiss from a Rose." Curious.')]));var Enemies=[],Enemy=function e(t,o){this.name=t,this.level=o,this.healthTotal=4*(o-1)+1+10,this.armor=4*(o-1)+1,this.quicknessProc=5,this.equippedWeapon=getRandomLootByLevel("weapons",o),this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)},CustomEnemy=function e(t,o,n,a,r,i){this.name=t,this.level=o,this.healthTotal=n,this.armor=r,this.quicknessProc=i,this.equippedWeapon=getObj(Items.weapons,a),this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)};Enemy.prototype.getBaseDamage=function(){return this.equippedWeapon?roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]):roll(0,3)},CustomEnemy.prototype.getBaseDamage=function(){return this.equippedWeapon?roll(this.equippedWeapon.damage[0],this.equippedWeapon.damage[1]):roll(0,3)},Enemy.prototype.attack=function(e){Player.attack.call(this,e)},CustomEnemy.prototype.attack=function(e){Player.attack.call(this,e)},Enemy.prototype.rollQuicknessProc=function(){return roll(0,100)<=this.quicknessProc},CustomEnemy.prototype.rollQuicknessProc=function(){return roll(0,100)<=this.quicknessProc};var enemies=[["Vagrant Ranger",1],["Gray Wolf",1],["Derranged Lunatic",1],["Highway Bandit",1],["Wandering Looter",1],["Cloaked Assassin",1],["Town Guard",2],["Black Wolf",2]],customEnemies=[["Sinclair Graves",4,40,"Wind Blade",10,5],["Target Dummy",2,1e3,"Foam Sword",1,0],["Volkswain the Unmarred",10,400,"Wind Blade",20,15]],buildNormalEnemy=function e(t,o){return new Enemy(t,o)},buildCustomEnemy=function e(t,o,n,a,r,i){return new CustomEnemy(t,o,n,a,r,i)},buildEnemies=function e(){var t=enemies.concat(customEnemies);forEach(t,function(e){e.length>2?Enemies.push(buildCustomEnemy.apply(null,e)):Enemies.push(buildNormalEnemy.apply(null,e))})};buildEnemies();var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},Acquaint=function e(t){this.buffer=15,this.enabled=!0,this.steps=t,this.index=0,this.completeMessage="That's it for now!",this.elements=[]},getWrapper=function e(){if(document.getElementById("acquaint"))return document.getElementById("acquaint");var t=document.createElement("div");return t.innerHTML='<div id="acquaint" class="acquaint-card"></div>',t.childNodes[0]},getContents=function e(t,o){var n=t.length,a=t[o],r="function"==typeof a.message?a.message():a.message,i=n>1?o+1+"/"+n+" - "+a.title:""+a.title;return'\n      <div class="acquaint-close">✕</div>\n      '+(a.title?'<div class="acquaint-header">'+i+"</div>":"")+'\n      <div class="acquaint-text">'+r+"</div>\n      "+(a.button?'<div class="acquaint-button">'+a.button+"</div>":"")+"\n  "};Acquaint.prototype.render=function(){var e=this,t=e.steps[e.index],o=getWrapper(),n=getContents(e.steps,e.index),a=void 0,r=void 0,i=void 0;if(o.innerHTML=n,t.advance){r=t.advance.event,a="object"===_typeof(t.advance.element)?t.advance.element:document.querySelector(t.advance.element),i=a[r];var s=function o(n){(!t.advance.condition&&e.enabled||t.advance.condition(n)&&e.enabled)&&(a[r]=i,null!==i&&a[r](n),e.advance())};i=a[r],a[r]=s}else o.querySelector(".acquaint-button")&&o.querySelector(".acquaint-button").addEventListener("click",function(){e.advance()});document.body.appendChild(o),e.elements.push(o),o.querySelector(".acquaint-close").onclick=function(){a[r]=i,e.remove()},this.position()},Acquaint.prototype.advance=function(){this.steps[this.index].callback&&this.steps[this.index].callback(),this.index+1<this.steps.length?(this.index++,this.render()):this.complete()},Acquaint.prototype.position=function(){var e=this.elements[this.index],t=this.steps[this.index].target,o=this.steps[this.index].position.split("-"),n=o[0],a=o[1],r=window.innerHeight,i=window.innerWidth,s=this.buffer,l,c,m,u,h;switch(t===window?(l={top:-window.scrollY,left:0,width:i,height:r},c=s,m=l.height-s-e.offsetHeight,u=s,h=l.width-s-e.offsetWidth,e.style.position="fixed"):(l=document.querySelector(t).getBoundingClientRect(),c=l.top+window.scrollY-(e.offsetHeight+s),m=l.bottom+window.scrollY+s,u=l.left,h=l.left+(l.width-e.offsetWidth)),n){case"top":c=c,u="left"===a?u:h;break;case"bottom":c=m,u="left"===a?u:h;break;case"left":u=l.left-e.offsetWidth-s,c="top"===a?l.top+window.scrollY:m;break;case"right":u=l.left+l.width+s,c="top"===a?l.top+window.scrollY:m;break}this.steps[this.index].fixed?(e.style.position="fixed",e.style.top=c-window.scrollY+"px",e.style.left=u+"px"):(e.style.top=c+"px",e.style.left=u+"px")},Acquaint.prototype.minimize=function(){var e=this,t=document.createElement("div"),o=this.steps.length,n=this.steps[this.index].title,a='<div class="aquaint-minimized">'+(this.index+1)+"/"+o+" - "+n+"</div>",r=this.elements[this.index];t.innerHTML=a,this.enabled=!1,r.style.display="none",t.childNodes[0].onclick=function(t){t.target.remove(),e.enabled=!0,r.style.display="flex"},document.body.appendChild(t.childNodes[0])},Acquaint.prototype.remove=function(){this.elements[this.index].remove(),this.enabled=!1},Acquaint.prototype.complete=function(){var e=this.elements[this.index];e.setAttribute("data-complete",this.completeMessage),e.classList.add("completed"),setTimeout(function(){e.remove()},3e3)},Acquaint.prototype.init=function(){var e=this;this.checkForErrors(),document.getElementById("acquaint")&&document.getElementById("acquaint").remove(),this.enabled&&(this.render(),window.onresize=function(){e.position()})},Acquaint.prototype.checkForErrors=function(){for(var e=0;e<this.steps.length;e++){var t=this.steps[e];if(t.button&&t.advance)throw new Error("You cannot have both button and advance properties")}};var Moments={moment0:{message:"You're dreaming you're in a small boat. The black water around you stirs.",choices:[{message:"Wake up",link:1}],onLoad:function e(){Player.reset(),UI.reset()}},moment1:{message:"You are suddenly conscious, and remember nothing before this dream.",choices:[{message:"Blink",link:2}]},moment2:{
message:"You are standing in a dark woods.",choices:[{message:"Look around",link:3}]},moment3:{message:"The sun has just set. You are surrounded by trees bathed in twilight.",choices:[{message:"Check your belongings",link:4}]},moment4:{message:"Looped to your belt you find a weapon.",choices:[{message:"Start Walking",link:5}],dropLoot:[["weapons",1]],onLoad:function e(){equipping.init()}},moment5:{message:"You walk until you see a glowing light spidering through the trees.",choices:[{message:"Take a closer look",link:6}]},moment6:{message:"From behind a tree you see a hunter stoking a fire. With him is a man tied up, slumped at the base of a tree.",choices:[{message:'"Where am I"?',link:8}]},moment8:{message:'"Somewhere you shouldn\'t be."',enemy:"Vagrant Ranger",dropLoot:[["armor",1],"Chicken Egg"],link:10},moment9:{message:"You find a road and begin walking west. Up ahead you see a figure on horseback galloping towards you.",choices:[{message:"Keep walking",link:14},{message:"Hide",link:15}]},moment10:{message:"After taking a minute to recover, you turn to the captured man.",choices:[{message:'"Are you alright?"',link:12},{message:"Take a closer look",link:12}],onLoad:function e(){healing.init()}},moment12:{message:"As you lean in to check if the man is alive, he suddenly lunges at you.",enemy:"Derranged Lunatic",dropLoot:[["armor",1],"Message"],link:13},moment13:{message:"You notice a lockbox on the ground near the fire.",choices:[{message:"Check it out",link:"13a"},{message:"Continue on",link:9}]},moment13a:{message:"There's nothing else here.",choices:[{message:"Continue on",link:9}],dropLoot:[["all",1],["consumables",1]]},moment14:{message:"As the man gets closer, he draws a sword.",choices:[{message:"Fight",link:16},{message:"Hide",link:15}]},moment15:{message:"You walk through a forest until you cannot see the road. Eventually you come upon a ruined mill.",choices:[{message:"Check out the mill",link:17},{message:"Go back to the road",link:18}]},moment16:{message:"You draw your weapon and stand your ground.",enemy:"Highway Bandit",dropLoot:[["all",1]],link:18},moment17:{message:"You approach the shoddy old mill until you can hear voices coming from inside.",choices:[{message:"Take a peek",link:"17b"},{message:"Bust in there",link:"17b"},{message:"Go back to the road",link:18}]},moment17b:{message:'"Who the fuck are you?" says Sinclair Black, a notable thief.',choices:[{message:'"Your mom"',link:"17c"},{message:"Punch him in the face",link:"17c"},{message:"Run away",link:18}]},moment17c:{message:'"You bitch, I will end you."',enemy:"Sinclair Graves",dropLoot:["Kusanagi the Grass Cutter","Centurian Cask","Jerky","Arturus Tabard"],link:29},moment18:{message:"You walk for miles until you see a steeple poking up from the treeline ahead. It seems you found a town.",choices:[{message:"Look around",link:19},{message:"Talk to someone",link:20}]},moment19:{message:"You walk to the town square and look around. Where would you like to go?",choices:[{message:"The Arms Shop",link:20},{message:"The General Store",link:21},{message:"The Inn",link:22},{message:"The Town Hall",link:24},{message:"Leave the town",link:15}]},moment20:{message:'You enter the arms shop. "Ahoy there traveler," says the owner. "What can I do for you?"',shop:[["weapons",1],["weapons",1],["weapons",2],["armor",1],["armor",2]],choices:[{message:"Leave the shop",link:19}]},moment21:{message:'You enter the general store. "Hey baby," says the clerk. "What can I help you with?"',shop:[["consumables",1],["consumables",1],["consumables",2],["consumables",2]],choices:[{message:"Leave the shop",link:19}]},moment22:{message:'You enter the inn. "Sup playa," says the innkeeper. "Would you like a room? Its 2 gold for the night."',choices:[{message:"Yes please",link:23},{message:"No thanks",link:19}]},moment23:{message:"You go up to your room and sleep off your wounds. You wake up feeling like a million bucks.",inn:2,choices:[{message:"Leave the inn",link:19},{message:"Get another room",link:23}]},moment24:{message:"You stand in the large chamber of the Town Hall. Merchants and town leaders are assembled in discussion.",choices:[{message:"Leave the hall",link:19},{message:"Look around",link:26},{message:"Ask for Jon Peterson",link:26},{message:"Talk to the tenant-in-chief",link:27}]},moment26:{message:'You approach a man writing at a desk near the entrance. "Do you know a man who goes by Jon Peterson?" you ask. "The man points to two men standing near a side entrance."',choices:[{message:"Go over",link:27},{message:"Do something else",link:24}]},moment27:{message:'The men spot you approaching. "Are you Jon Peterson? you ask." He seems to look you over until replying "Yes I am. Would you like to join me for a drink? You look like you could use it."',choices:[{message:"Go with him",link:28},{message:"Do something else",link:24}]},moment28:{message:"You walk outside and turn the corner. The cloaked man with Jon Peterson suddenly pulls a dagger on you and attacks.",enemy:"Cloaked Assassin",dropLoot:[["all",2]],link:24},moment29:{message:"Wow. Either you cheated or you're really good. Well this is the end. If you want to help keep the journey alive email me at g.hastings3@gmail.com."},playerLost:{message:"You were killed. Sorry.",choices:[{message:"Start over",link:0}],onLoad:function e(){equipping.enabled=!1,healing.enabled=!1}}};Player.updateStats(),Player.updateGold(0),UI.itemDescription.bindStatEvents();var equipping=new Acquaint([{title:"Equipping items",message:function e(){return"You found a weapon! When equipped, weapons and armor apply their stats to your character. Click on that "+Player.inventory[0].name+" now to equip."},target:".inventory-list li",position:"bottom-left",advance:{element:".inventory-list li",event:"onclick"}},{title:"Understanding stats",message:"These are your stats. Increasing them with items and leveling up makes you more powerful. Hover over them to see what they do.",target:'[data-stat="damage"]',position:"right-bottom",button:"Got it"}]),healing=new Acquaint([{title:"Combat",message:"Well done. In combat, you exchange damage with an enemy until one of your health reaches 0. Victory rewards you with loot, gold, and experience points. Die, and you start over.",target:window,position:"top-right",button:"Got it"},{title:"Healing yourself",message:"You'll usually get injured in combat. Some items, like this egg, restore health points. Heals can be used anytime, even while fighting. Try using it now.",target:'[data-item="Chicken Egg"]',position:"bottom-left",advance:{element:'[data-item="Chicken Egg"]',event:"onclick"}}]);