import * as THREE from './threejs/build/three.module.js';	//Import de ThreeJS
THREE_ = THREE

import { OrbitControls } from './threejs/autres/OrbitControls.js';

import { OBJLoader } from './threejs/autres/OBJLoader.js';

import {cree_quadrillage, cree_repere, cree_repere_propre, cree_normale_facette} from './fonctions_3D.js';

import { VRButton } from './threejs/autres/VRButton.js';


import * as CSG from './THREECSG/ThreeCSG.js'
CSG_=CSG;

// <<<<<<<



// >>>>>>>>>>



// Variables globales (beurk)

var largeur_scene = 800;
var hauteur_scene = 600;



// GROUPES ================
function init(){


	// SCENE
	scene = new THREE.Scene();
	scene.scale.x=scene.scale.y=scene.scale.z = ZOOM_INITIAL; //On dézoom pour voir la piece mecanique
	
	// CAMERA
	camera = new THREE.PerspectiveCamera(50, largeur_scene/hauteur_scene, 0.1, 1000);
	camera.position.set(1, 2, 3);
	camera.lookAt(new THREE.Vector3(0,0,0));
	

	
	// LUMIERE
	ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
	scene.add(ambientLight);
	
	light = new THREE.PointLight(0xffffff, 0.8, 18);
	light.position.set(-3,6,-3);
	light.castShadow = false;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);
	
	light = new THREE.DirectionalLight( 0xffffff, 0.5 );
	light.position.set(1,1,-1)
	light.castShadow = false;
	light.shadow.camera.near = 0.1;
	light.shadow.camera.far = 25;
	scene.add(light);

	



	// CUBE ENTIER
	
	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	geometry_initiale =  new THREE.BoxGeometry( 1, 1, 1 );
//	geometry.translate(0.5,0.5,0.5);
	material = new THREE.MeshPhongMaterial({color:0x00ff00});
	material.transparent=true;
	mesh_cube_deforme = new THREE.Mesh( geometry, material ); 


	
	
	
	// MASQUE POUR LA FACETTE
	
	material_decoupe = new THREE.MeshPhongMaterial({color:0x00ff00});
	var geometry_masque = new THREE.BoxGeometry( 100, 100, 100 ); //On fait une grande boite
	geometry_masque.translate(0,0,50);
	mesh_masque = new THREE.Mesh( geometry_masque, material_decoupe );
	
	var masque_BSP = new CSG.ThreeBSP(mesh_masque);
	var cube_deforme_BSP = new CSG.ThreeBSP(mesh_cube_deforme);
	
	var geometry_cube_decoupe = cube_deforme_BSP.subtract(masque_BSP).toBufferGeometry();
	mesh_cube_decoupe = new THREE.Mesh( geometry_cube_decoupe, material_decoupe ); 
	mesh_cube_decoupe.visible=false;
	
	
	
	// Normal à la facette
	cree_normale_facette();

	// Vecteur contrainte
	vecteurContrainte3D = new THREE.ArrowHelper( new THREE.Vector3( 0, 1, 1 ).normalize(), new THREE.Vector3( 0, 0, 0 ), 0, 0xFF0000, 0.2, 0.1 ); //Vecteur Direction / Vecteur Origine / Taille / couleur / Longueur tete / diametre tete
	vecteurContrainte3D.children[0].material.linewidth=5;
	vecteurContrainte3D.visible = false;
	scene.add(vecteurContrainte3D);
	
	
	//Quadrillage
	cree_quadrillage(scene);
	
	//Repere
	cree_repere(scene);
	
	//Repere
	cree_repere_propre(scene,epsilon);
	
	
	//Bielle (format OBJ)
	const loader = new OBJLoader();	//On créé un "chargeur" qui va charger en arrière plan le modèle
	loader.load( 'sources/model/bielle.obj', function ( obj ) {
					//On crée un nouveau matériau
					  const material = new THREE.MeshPhongMaterial({
						    color:0xAAAAAA,
						    opacity: 0.5,
						    transparent: true,
						  });
					//On l'applique à l'objet
						obj.traverse( function ( child ) {
							if ( child instanceof THREE.Mesh ) {
							    child.material = material;
							}});



					objet_mecanique=obj;
					scene.add(objet_mecanique);
					t_DEBUT_ANIM=Date.now()/1000.;
					INTRO=true;	//On démarre l'intro
					//On enlève le message 
					$("#message_chargement_fenetre_3D").remove();
				});	//, onProgress, onError );
	
	
	// SCENE ==========================================
	scene.add(mesh_cube_deforme)
	scene.add(mesh_cube_decoupe)
	//scene.add(mesh_masque)
	
	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setSize(largeur_scene, hauteur_scene);

	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.BasicShadowMap;
	renderer.setClearColor( 0xffffff)
	//renderer.antialias=true;
	
	//document.body.appendChild(renderer.domElement);
	document.getElementById("visu").appendChild(renderer.domElement);
	
	//VR
	document.getElementById("conteneur_bouton_VR").appendChild( VRButton.createButton( renderer) );
//	document.body.appendChild( VRButton.createButton( renderer ) );
	$("#VRButton").css("position","static");//Replace le bouton à une meilleure place
	$("#VRButton").css("opacity","1");//Replace le bouton à une meilleure place

	renderer.xr.enabled = true;
	
	//Manettes 3D
	var geometryTest = new THREE.BoxGeometry( 0.1, 0.1, 0.5 );
	var materialTest = new THREE.MeshPhongMaterial({color:0xFF0000});
	var mesh_test = new THREE.Mesh( geometryTest, materialTest ); 
	
	manette1 = renderer.xr.getController(0);
	var fleche_manette1 = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 1 ).normalize(), new THREE.Vector3( 0, 0, 0 ), 0, 0x000000, 0.2, 0.1 ); //Vecteur Direction / Vecteur Origine / Taille / couleur / Longueur tete / diametre tete
	manette1.add( mesh_test );
	scene.add(manette1)
	//manette1bis = renderer.xr.getControllerGrip(0);
	
	// INTERAcTION
	controls = new OrbitControls( camera, renderer.domElement );
	controls.target = new THREE.Vector3(0.,0.,0.);
	
	
//	animate();
	renderer.setAnimationLoop(animate);
}



function update_graphismes()
{
	
//	On recree la base oriore
	scene.remove(base_propre);
	cree_repere_propre(scene,epsilon);
}


function animate(){

	var t = Date.now()/1000.-t_DEBUT_ANIM; //Date depuis le début d el'anim (en s)

	
	
	mesh_cube_deforme.geometry.verticesNeedUpdate=true;
	
	if(INTRO)
	{
		var T=5;//en seconde
		scene.scale.x=	math.pow((1-ZOOM_INITIAL)/2.*math.sin((t-T/2.)*math.pi/T)+(ZOOM_INITIAL+1)/2.,3);
		scene.scale.y=scene.scale.z=scene.scale.x;
		//On change l'opacité de tous les enfants de la piece mecanique
		objet_mecanique.children[0].material.opacity=1-t/T;
		
		if (t>=T)
		{
			INTRO=false;
			objet_mecanique.visible=false;
		}
	}
	
	
	
	if(UPDATE_GRAPHISMES)
	{
		UPDATE_GRAPHISMES=false;
		update_graphismes();
	}
	
		compteur_UPDATE_NORMALE_FROM_MANETTE+=1;
	
	
	if(UPDATE_NORMALE_FROM_MANETTE && compteur_UPDATE_NORMALE_FROM_MANETTE%20==0)
	{
		udpateNormaleVecteurFromControlleurVR();
	}
	
	controls.update(); //Mise a jour position camera
	renderer.render(scene, camera);
}


window.onload = init;
