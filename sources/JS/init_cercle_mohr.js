var stage_Mohr = new createjs.Stage("canvas_cercle_mohr");


// Scene principale
scene_Mohr = new createjs.Container();
scene_Mohr.x = parseInt($("#canvas_cercle_mohr").attr("width"))/2;
scene_Mohr.y = parseInt($("#canvas_cercle_mohr").attr("height"))/2;
scene_Mohr.scale=1;
stage_Mohr.addChild(scene_Mohr);


// REPERE =======
var axes = new createjs.Container();
scene_Mohr.axes = axes;
scene_Mohr.addChild(axes)

var axeX = new Bipoint({x:-250,y:0},{x:250,y:0})
axes.axeX = axeX;
axes.addChild(axeX);

var textX = new createjs.Text("σ", "20px Arial", "black");
 textX.x = 230;
 textX.y = -15;
 textX.textBaseline = "alphabetic";
axes.textX = textX;
axes.addChild(textX);


var axeY = new Bipoint({x:0,y:150},{x:0,y:-150})
axes.axeY = axeY;
axes.addChild(axeY);

var textY = new createjs.Text("τ", "20px Arial", "black");
 textY.x = 15;
 textY.y = -135;
 textY.textBaseline = "alphabetic";
axes.textY = textY;
axes.addChild(textY);

// DESSIN =======================
dessin_mohr = new createjs.Container();
scene_Mohr.addChild(dessin_mohr)


// Curseur ==========================
cursorCercleDeMohr = new createjs.Shape();
cursorCercleDeMohr.graphics.beginStroke("blue").drawCircle(0,0, 2) ;
cursorCercleDeMohr.graphics.moveTo(-5,0).lineTo(5,0) ;
cursorCercleDeMohr.graphics.moveTo(0,5).lineTo(0,-5) ;

scene_Mohr.addChild(cursorCercleDeMohr) ;
cursorCercleDeMohr.x = 100000 ;
cursorCercleDeMohr.y = 200000 ;

stage_Mohr.update();



// EVENEMENTS ========================
function actionMolette(event)
{
	event.preventDefault(); // Supprime le scrolling d'origine
	var val = event.originalEvent.wheelDelta;
		facteur = 1+val/1000;
		
	zoom_Mohr *= facteur;
	
	var posSouris = {x:stage_Mohr.mouseX,y:stage_Mohr.mouseY}
	var posScene = {x:scene_Mohr.x,y:scene_Mohr.y}
	

	// MAJ des coordonnées des points ====
	dessin_mohr.children.forEach(function(child)
		{
			child.x *= facteur;
			child.y *= facteur;
		})
	cursorCercleDeMohr.x *= facteur;
	cursorCercleDeMohr.y *= facteur;
	
	// MAJ de la position du dessin et des axes
	scene_Mohr.x -= (1-facteur)*(posScene.x-posSouris.x)
	scene_Mohr.y -= (1-facteur)*(posScene.y-posSouris.y)
	
	
	
	// REDESSINE AXES...
	// A redessiner completement....
	scene_Mohr.axes.axeX.x += (1-facteur)*(posScene.x-posSouris.x);
	scene_Mohr.axes.textX.x += (1-facteur)*(posScene.x-posSouris.x);
	scene_Mohr.axes.axeY.y += (1-facteur)*(posScene.y-posSouris.y);
	scene_Mohr.axes.textY.y += (1-facteur)*(posScene.y-posSouris.y);
	
	stage_Mohr.update();
}
$("#canvas_cercle_mohr").on("wheel",actionMolette)
