"use strict";var GameState={currentMoment:"",setCurrentMoment:function(e){this.currentMoment=e,UI.narrative.renderMoment(),this.checkForAndCreateChoices(),this.checkForAndPickUpLoot(),this.checkForAndRunCombat(),this.checkForAndOpenUpShop(),this.checkForAndRunInn(),UI.scrollToBottom(UI.narrative.el)},checkForFoundLoot:function(){return this.currentMoment.hasOwnProperty("dropLoot")&&!this.currentMoment.hasOwnProperty("enemy")},checkForAndPickUpLoot:function(){this.checkForFoundLoot()&&Player.pickUpLoot()},checkForAndRunCombat:function(){this.currentMoment.hasOwnProperty("enemy")&&runCombat()},checkForAndOpenUpShop:function(){this.currentMoment.hasOwnProperty("shop")?(UI.narrative.renderShop(),this.bindShopItemEvents()):this.bindWorldItemEvents()},checkForAndRunInn:function(){if(this.currentMoment.hasOwnProperty("inn")){var e=this.currentMoment.inn;Player.gold>=e?(Player.updateGold(-e),Player.healthTotal=Player.healthMax,Player.updateStats(),UI.combatLog.renderCombatLog("You bought a room for "+e+" gold"),UI.combatLog.renderCombatLog("Your health is fully restored")):UI.combatLog.renderCombatLog("You need "+(e-Player.gold)+" gold to get a room.")}},checkForAndCreateChoices:function(){this.currentMoment.hasOwnProperty("choices")&&UI.narrative.renderChoices()},bindWorldItemEvents:function(){for(var e=UI.inventory.el.querySelectorAll("[data-item]"),t=0;t<e.length;t++)e[t].onclick=UI.inventory.activateItem},bindShopItemEvents:function(){for(var e=UI.narrative.el.querySelectorAll("[data-item]"),t=UI.inventory.el.querySelectorAll("[data-item]"),n=0;n<e.length;n++)e[n].onclick=Player.purchaseItem;for(var r=0;r<t.length;r++)t[r].onclick=Player.sellItem}},Player={name:"You",healthMax:25,healthTotal:25,armor:0,strength:0,quickness:1,equippedWeapon:"",equippedArmor:[],inventory:[],gold:0,updateStats:function(){this.setHealth(),this.setDamage(),this.setArmor(),this.setDamageReduction(),this.setQuicknessProc(),UI.statlist.renderStats()},updateGold:function(e){this.gold+=e,UI.inventory.renderGold()},setHealth:function(){this.health=""+this.healthTotal+"/"+this.healthMax},setArmor:function(){if(this.armor=0,this.equippedArmor.length>0)for(var e=0;e<this.equippedArmor.length;e++)this.armor+=this.equippedArmor[e].armorAmt;this.armor+=this.strength},setDamage:function(){this.equippedWeapon?this.damage=""+this.equippedWeapon.damageMin+"-"+this.equippedWeapon.damageMax:this.damage="0-2"},setDamageReduction:function(){this.damageReduction=(1-.03*this.armor/(1+.03*this.armor)).toFixed(2)},setStrength:function(){this.healthTotal=this.healthTotal+this.strength,this.healthMax=this.healthMax+this.strength},setQuicknessProc:function(){this.quicknessProc=(.02*this.quickness/(1+.02*this.quickness)*100).toFixed(2)},getBaseDamage:function(){var e;e=this.equippedWeapon?roll(this.equippedWeapon.damageMin,this.equippedWeapon.damageMax):roll(0,3),this.baseDamage=e},rollQuicknessProc:function(){var e=roll(0,100);return e<=this.quicknessProc?!0:!1},attack:function(e){this.getBaseDamage();var t=Math.round(this.baseDamage*e.damageReduction),n="hit";this.rollQuicknessProc()&&(t=2*t,n="critically hit"),e.rollQuicknessProc()?UI.combatLog.renderCombatLog("("+e.healthTotal+") "+e.name+" dodged "+this.name+" for 0"):(e.healthTotal-=t,UI.combatLog.renderCombatLog("("+this.healthTotal+") "+this.name+" "+n+" "+e.name+" for "+t)),this.equippedWeapon.effect&&this.equippedWeapon.effect.run()===!0&&this.equippedWeapon.effect.proc(e,this.equippedWeapon)},pickUpGold:function(){var e=getObj(Enemies,GameState.currentMoment.enemy).level,t=roll(3,6)*e;Player.updateGold(t)},pickUpLoot:function(){for(var e=0;e<GameState.currentMoment.dropLoot.length;e++){var t=GameState.currentMoment.dropLoot[e];this.addToInventory(t)}UI.combatLog.renderLootMessage()},addToInventory:function(e){var t=getObj(Items,e);this.inventory.push(t),UI.inventory.renderInventory()},removeFromInventory:function(e){var t=getObj(this.inventory,e),n=this.inventory.indexOf(t);n>-1&&this.inventory.splice(n,1)},equipWeapon:function(e){this.unequipCurrentWeapon(),this.equippedWeapon=getObj(this.inventory,e),this.updateStats()},equipArmor:function(e){var t=getObj(this.inventory,e);this.checkIfArmorSlotIsTaken(t)&&this.unequipArmor(t),getObj(this.equippedArmor,e)||(this.equippedArmor.push(t),this.updateStats())},unequipArmor:function(e){var t=getFromArr(this.equippedArmor,e.slot),n=this.equippedArmor.indexOf(t);t.effect&&t.effect.removeBuff(),n>-1&&this.equippedArmor.splice(n,1)},unequipCurrentWeapon:function(){this.equippedWeapon.effect===typeof Statbuff&&this.equippedWeapon.effect.removeBuff(),this.equippedWeapon&&(this.equippedWeapon="")},checkIfArmorSlotIsTaken:function(e){return getFromArr(this.equippedArmor,e.slot)?!0:void 0},purchaseItem:function(){var e=this.getAttribute("data-item"),t=getObj(Items,e);Player.gold>=t.getPurchasePrice()?(Player.updateGold(-t.getPurchasePrice()),Player.addToInventory(e),UI.inventory.renderInventory(),UI.combatLog.renderItemTransaction(t.name,t.getPurchasePrice(),"bought")):UI.combatLog.renderCannotPurchaseMessage(t.name,t.getPurchasePrice())},sellItem:function(){var e=this.getAttribute("data-item"),t=getObj(Items,e);Player.updateGold(t.getSalePrice()),t===Player.equippedWeapon&&Player.unequipCurrentWeapon(),getObj(Player.equippedArmor,e)&&Player.unequipArmor(t),Player.removeFromInventory(e),Player.updateStats(),UI.inventory.renderInventory(),UI.combatLog.renderItemTransaction(t.name,t.getSalePrice(),"sold")}},UI={items:document.querySelectorAll("[data-item]"),colors:{none:"#999",common:"#fff",rare:"#4D75CE",epic:"#9E65C4",legendary:"#C6AF66"},narrative:{el:document.getElementById("narrative"),getMomentByClick:function(){var e=this.getAttribute("data-moment");GameState.setCurrentMoment(Moments["moment"+e])},renderShop:function(){for(var e=GameState.currentMoment.shop,t=UI.inventory.el.querySelectorAll("[data-item]"),n=0;n<e.length;n++){var r=getObj(Items,e[n]),o=document.createElement("a"),i=document.createTextNode(r.name);o.setAttribute("data-item",r.name),o.appendChild(i),UI.narrative.el.appendChild(o),o.onclick=Player.purchaseItem}for(var a=0;a<t.length;a++)t[a].onclick=Player.sellItem;UI.items=document.querySelectorAll("[data-item]"),UI.itemDescription.bindItemDescriptionEvents()},renderChoices:function(){for(var e=GameState.currentMoment.choices,t=0;t<e.length;t++){var n=e[t],r=document.createElement("a"),o=document.createTextNode(n.message);r.setAttribute("data-moment",n.link),r.appendChild(o),UI.narrative.el.appendChild(r),r.onclick=this.getMomentByClick}},renderMoment:function(){var e=document.createElement("p"),t=document.createTextNode(GameState.currentMoment.message);e.appendChild(t),UI.narrative.el.appendChild(e)}},statlist:{el:document.getElementById("stat-list"),renderStats:function(){for(var e=this.el.querySelectorAll("dd"),t=0;t<e.length;t++){var n=e[t].getAttribute("data-stat");e[t].innerHTML=Player[n]}}},inventory:{el:document.getElementById("inventory"),gold:document.getElementById("gold"),renderInventory:function(){this.el.innerHTML="";for(var e=0;e<Player.inventory.length;e++){var t=Player.inventory[e],n=document.createElement("li"),r=document.createTextNode(t.name);n.appendChild(r),this.el.appendChild(n),n.setAttribute("data-item",t.name),GameState.currentMoment.hasOwnProperty("shop")?GameState.bindShopItemEvents():GameState.bindWorldItemEvents(),t===Player.equippedWeapon&&this.renderEquippedWeapon(n),getObj(Player.equippedArmor,t.name)&&!UI.inventory.el.querySelector('[data-item="'+t.name+'"]').getAttribute("class","equipped-armor")&&n.setAttribute("class","equipped-armor")}UI.items=document.querySelectorAll("[data-item]"),UI.itemDescription.bindItemDescriptionEvents()},renderGold:function(){UI.inventory.gold.innerHTML=Player.gold},removeEquippedWepTag:function(){var e=document.querySelector(".equipped-wep");e&&e.setAttribute("class","")},removeEquippedArmorTag:function(){for(var e=document.querySelectorAll(".equipped-armor"),t=0;t<e.length;t++)e[t].setAttribute("class","")},activateItem:function(){var e=this.getAttribute("data-item"),t=getObj(Items,e);"weapon"===t.itemType&&Player.equippedWeapon!==t&&(Player.equipWeapon(e),UI.inventory.renderEquippedWeapon(this),t.use()),"armor"!==t.itemType||getObj(Player.equippedArmor,e)||(Player.equipArmor(e),UI.inventory.renderEquippedArmor(),t.use()),"consumable"===t.itemType&&(Player.removeFromInventory(e),UI.itemDescription.hideItemDescription(),UI.inventory.renderInventory(),t.use())},renderEquippedWeapon:function(e){this.removeEquippedWepTag(),e.setAttribute("class","equipped-wep")},renderEquippedArmor:function(){this.removeEquippedArmorTag();for(var e=0;e<Player.equippedArmor.length;e++)UI.inventory.el.querySelector('[data-item="'+Player.equippedArmor[e].name+'"').setAttribute("class","equipped-armor")}},itemDescription:{el:document.getElementById("itemDescription"),components:{displayName:document.getElementById("displayName"),itemAttack:document.getElementById("itemAttack"),itemArmor:document.getElementById("itemArmor"),itemEffect:document.getElementById("itemEffect"),flavorText:document.getElementById("flavorText"),salePrice:document.getElementById("salePrice"),itemLevel:document.getElementById("itemLevel")},getItemDescriptionY:function(e){var t=e.pageY;return""+t+"px"},getItemDescriptionX:function(e){var t=e.pageX;return""+t+"px"},positionItemDescription:function(e){UI.itemDescription.el.style.top=UI.itemDescription.getItemDescriptionY(e),UI.itemDescription.el.style.left=UI.itemDescription.getItemDescriptionX(e)},showItemDescription:function(){UI.itemDescription.el.style.display="block"},hideItemDescription:function(){UI.itemDescription.el.style.display="none",UI.itemDescription.components.itemAttack.innerHTML="",UI.itemDescription.components.itemEffect.innerHTML=""},renderItemDescription:function(){var e=this.getAttribute("data-item"),t=getObj(Items,e);UI.itemDescription.components.displayName.innerHTML=t.name,UI.itemDescription.components.displayName.style.color=UI.colors[t.rarity],UI.itemDescription.components.itemLevel.innerHTML="Level "+t.level,"weapon"===t.itemType&&(UI.itemDescription.components.itemAttack.innerHTML="Damage: "+t.damageMin+"-"+t.damageMax),"armor"===t.itemType&&(UI.itemDescription.components.itemAttack.innerHTML="Armor: "+t.armorAmt),t.flavorText?UI.itemDescription.components.flavorText.innerHTML=t.flavorText:UI.itemDescription.components.flavorText.innerHTML="",t.effect&&(UI.itemDescription.components.itemEffect.innerHTML=t.desc()),this.parentNode===UI.inventory.el?UI.itemDescription.components.salePrice.innerHTML=""+t.getSalePrice():this.parentNode===UI.narrative.el?UI.itemDescription.components.salePrice.innerHTML=""+t.getPurchasePrice():UI.itemDescription.components.salePrice.innerHTML="",UI.itemDescription.showItemDescription()},getStatDescriptions:{health:function(){return"If you run out, you die."},armor:function(){return"Reduces damage taken to "+(100*Player.damageReduction).toFixed(2)+"%"},quickness:function(){return""+Player.quicknessProc+"% chance to critical hit and dodge"},damage:function(){var e=(Player.equippedWeapon.damageMax+Player.equippedWeapon.damageMin)/2,t=(e+Player.quicknessProc/100*e).toFixed(2);return""+t+" average damage per hit"},strength:function(){return"Increases armor and max health by "+Player.strength}},renderStatDescription:function(){var e=this.getAttribute("data-stat");UI.itemDescription.components.displayName.innerHTML=e,UI.itemDescription.components.displayName.style.color="white",UI.itemDescription.components.itemAttack.innerHTML="",UI.itemDescription.components.salePrice.innerHTML="",UI.itemDescription.components.flavorText.innerHTML=UI.itemDescription.getStatDescriptions[e](),UI.itemDescription.showItemDescription()},bindItemDescriptionEvents:function(){for(var e=document.querySelectorAll("[data-item]"),t=document.querySelectorAll("[data-stat]"),n=0;n<e.length;n++)e[n].onmouseenter=this.renderItemDescription,e[n].onmousemove=this.positionItemDescription,e[n].onmouseleave=this.hideItemDescription;for(var r=0;r<t.length;r++)t[r].onmouseenter=this.renderStatDescription,t[r].onmousemove=this.positionItemDescription,t[r].onmouseleave=this.hideItemDescription}},combatLog:{el:document.getElementById("combatLog"),renderCombatLog:function(e){var t=document.createElement("p"),n=document.createTextNode(e);t.appendChild(n),this.el.appendChild(t),UI.scrollToBottom(UI.combatLog.el)},renderItemTransaction:function(e,t,n){this.renderCombatLog("You "+n+" "+e+" for "+t+" gold.")},renderCannotPurchaseMessage:function(e,t){this.renderCombatLog("You need "+(t-Player.gold)+" gold to buy "+e+".")},renderLootMessage:function(){var e=GameState.currentMoment;if(e.enemy)if(e.dropLoot.length>0){var t=e.dropLoot;this.renderCombatLog("You defeated the "+e.enemy+" and found "+t+".")}else this.renderCombatLog("You defeated the "+e.enemy+".");else this.renderCombatLog("You found "+e.dropLoot)}},scrollToBottom:function(e){e.scrollTop=e.scrollHeight}},roll=function(e,t){return Math.floor(Math.random()*(t-e+1))+e},getObj=function(e,t){var n=e.filter(function(e){return e.name===t});return n?n[0]:null},getFromArr=function(e,t){var n=e.filter(function(e){return e.slot===t});return n?n[0]:null},getObjLvl=function(e,t){for(var n=[],r=0;r<e.length;r++)e[r].level===t&&n.push(e[r]);return n},getRandomLootByLevel=function(e,t){var n=getObjLvl(e,t);return n[roll(0,n.length-1)].name},runCombat=function(){for(var e=getObj(Enemies,GameState.currentMoment.enemy),t=new Enemy(e.name,e.level,e.healthTotal,getObj(Items,e.equippedWeapon),e.armor,e.critChance),n=!0;n;)Player.healthTotal>0?(Player.attack(t),t.healthTotal>0?t.attack(Player):(n=!1,Player.pickUpLoot(),Player.pickUpGold(),Player.updateStats(),GameState.setCurrentMoment(Moments["moment"+GameState.currentMoment.link]))):(n=!1,UI.combatLog.renderCombatLog("You were slain by "+t.name),Player.updateStats(),GameState.setCurrentMoment(Moments.playerLost))};document.addEventListener("DOMContentLoaded",function(){Player.updateStats(),Player.updateGold(0)});