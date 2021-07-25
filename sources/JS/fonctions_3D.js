import * as THREE from './threejs/build/three.module.js';	//Import de ThreeJS

export function cree_quadrillage(scene)
{
	quadrillage = new THREE.Group();


	// QUADRILLAGE ======

	// X
	for(var y=MIN_Y ; y<=MAX_Y ; y++)
		{for(var z=MIN_Z ; z<=MAX_Z ; z++)
			{
				var geometry = new THREE.CylinderGeometry( 0.01, 0.01, MAX_X-MIN_Y, 4 );
				geometry.translate(0,(MAX_X-MIN_X)/2.+MIN_X,0);
				var dist = Math.sqrt(z*z+y*y);
				var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF, transparent: true, opacity:(1./(1+2*dist*dist*dist))} );
				var cylinder = new THREE.Mesh( geometry, material );
				cylinder.translateY(y);
				cylinder.translateZ(z);
				cylinder.rotateZ(-Math.PI/2);
				quadrillage.add( cylinder );
			}
		}
	// Y
	for(var x=MIN_X ; x<=MAX_X ; x++)
		{for(var z=MIN_Z ; z<=MAX_Z ; z++)
			{
				var geometry = new THREE.CylinderGeometry( 0.01, 0.01, MAX_Y-MIN_Y, 4 );
				geometry.translate(0,(MAX_Y-MIN_Y)/2.+MIN_Y,0);
				var dist = Math.sqrt(z*z+x*x);
				var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF, transparent: true, opacity:(1./(1+2*dist*dist*dist))} );
				var cylinder = new THREE.Mesh( geometry, material );
				cylinder.translateX(x);
				cylinder.translateZ(z);
				quadrillage.add( cylinder );
			}
		}
	
	// Z
	for(var y=MIN_Y ; y<=MAX_Y ; y++)
		{for(var x=MIN_X ; x<=MAX_X ; x++)
			{
				var geometry = new THREE.CylinderGeometry( 0.01, 0.01, MAX_Z-MIN_Z, 4 );
				geometry.translate(0,(MAX_Z-MIN_Z)/2.+MIN_Z,0);
				var dist = Math.sqrt(x*x+y*y);
				var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF, transparent: true, opacity:(1./(1+2*dist*dist*dist))} );
				var cylinder = new THREE.Mesh( geometry, material );
				cylinder.translateY(y);
				cylinder.translateX(x);
				cylinder.rotateX(Math.PI/2);
				quadrillage.add( cylinder );
			}
		}
		
	scene.add(quadrillage);
	quadrillage.visible=false;
	
	
	
	
}


// FONCTION QUI CREE LES OBJETS 3D AXES ======================

export function cree_repere(scene)
{

	axes = new THREE.Group();
	var rayon_graduations=0.02;
	
	// AXES 
	//X
	var geometry = new THREE.CylinderGeometry( 0.015, 0.015, MAX_X-MIN_X, 4 );
	geometry.translate(0,(MAX_X-MIN_X)/2.+MIN_X,0);
	var material = new THREE.MeshPhongMaterial( {color: 0xFF0000} );
	var cylinder = new THREE.Mesh( geometry, material );
	cylinder.rotateZ(-Math.PI/2);
	axes.add( cylinder );
	//Y
	var geometry = new THREE.CylinderGeometry( 0.015, 0.015, MAX_Y-MIN_Y, 4 );
	geometry.translate(0,(MAX_Y-MIN_Y)/2.+MIN_Y,0);
	var material = new THREE.MeshPhongMaterial( {color: 0xFF0000} );
	var cylinder = new THREE.Mesh( geometry, material );
	axes.add( cylinder );
	//Z
	var geometry = new THREE.CylinderGeometry( 0.015, 0.015, MAX_Z-MIN_Z, 4 );
	geometry.translate(0,(MAX_Z-MIN_Z)/2.+MIN_Z,0);
	var material = new THREE.MeshPhongMaterial( {color: 0xFF0000} );
	var cylinder = new THREE.Mesh( geometry, material );
	cylinder.rotateX(Math.PI/2);
	axes.add( cylinder );
		
		
	//GRADUATIONS
	
	for(var i=MIN_X;i<=MAX_X;i+=0.1)
	{
		var rayon=rayon_graduations;
		if (Math.abs(i%0.5)<0.01 || Math.abs(i%0.5)>0.4999)	rayon*=2;
		if (Math.abs(i%1)<0.01 || Math.abs(i%1)>0.9999)		rayon*=2;
		
		
		//x
		var geometry = new THREE.CylinderGeometry( rayon, rayon, 0.01, 16 );
		var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF } );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.translateX(i);
		cylinder.rotateZ(Math.PI/2);
		axes.add( cylinder );
	}
	
	
	for(var i=MIN_Y;i<=MAX_Y;i+=0.1)
	{
		var rayon=rayon_graduations;
		if (Math.abs(i%0.5)<0.01 || Math.abs(i%0.5)>0.4999)	rayon*=2;
		if (Math.abs(i%1)<0.01 || Math.abs(i%1)>0.9999)		rayon*=2;
		
		//Y
		var geometry = new THREE.CylinderGeometry( rayon, rayon, 0.01, 16 );
		var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF } );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.translateY(i);
		axes.add( cylinder );
		
	}
	
	
	for(var i=MIN_Z;i<=MAX_Z;i+=0.1)
	{
		var rayon=rayon_graduations;
		if (Math.abs(i%0.5)<0.01 || Math.abs(i%0.5)>0.4999)	rayon*=2;
		if (Math.abs(i%1)<0.01 || Math.abs(i%1)>0.9999)		rayon*=2;
		
		//Z
		var geometry = new THREE.CylinderGeometry( rayon, rayon, 0.01, 16 );
		var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF } );
		var cylinder = new THREE.Mesh( geometry, material );
		cylinder.translateZ(i);
		cylinder.rotateX(Math.PI/2);
		axes.add( cylinder );
	}
	
	
	//TEXT
	var loader = new THREE.FontLoader();
	loader.load( './sources/JS/fonts/helvetiker_regular.typeface.json', function ( font ) {
	
		//X
		var geometry = new THREE.TextGeometry( 'X', {
			font: font,
			size: 0.1,
			height: 0.01,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.01,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5
		} );
		var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF } );
		var textX = new THREE.Mesh( geometry, material );
		textX.translateX(MAX_X+rayon_graduations);
		axes.add( textX );
		
		//Y
		var geometry = new THREE.TextGeometry( 'Y', {
			font: font,
			size: 0.1,
			height: 0.01,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.01,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5
		} );
		var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF } );
		var textY = new THREE.Mesh( geometry, material );
		textY.translateY(MAX_Y+rayon_graduations);
		axes.add( textY );
		
		//Y
		var geometry = new THREE.TextGeometry( 'Z', {
			font: font,
			size: 0.1,
			height: 0.01,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.01,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5
		} );
		var material = new THREE.MeshPhongMaterial( {color: 0xAAAAFF } );
		var textZ = new THREE.Mesh( geometry, material );
		textZ.translateZ(MAX_Z);
		textZ.translateX(6*rayon_graduations);
		axes.add( textZ );
	} );
	
	scene.add(axes);
}




// FONCTION QUI CREE LES axes propres ======================

export function cree_repere_propre(scene,mat)
{
	base_propre = new THREE.Group();
	
	var vecteurs_propres=math.eigs(mat.toArray()).vectors;
	//console.log(mat._data);
	var V1 = new THREE.Vector3(vecteurs_propres[0][0],vecteurs_propres[1][0],vecteurs_propres[2][0]);
	var V2 = new THREE.Vector3(vecteurs_propres[0][1],vecteurs_propres[1][1],vecteurs_propres[2][1]);
	var V3 = new THREE.Vector3(vecteurs_propres[0][2],vecteurs_propres[1][2],vecteurs_propres[2][2]);
	
	
	//X
	var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	var points = [];
		points.push( V1.clone().multiplyScalar(MIN_X) );
		points.push( V1.clone().multiplyScalar(MAX_X) );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var line = new THREE.Line( geometry, material );
	base_propre.add(line);
	
	//Y
	var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	var points = [];
		points.push( V2.clone().multiplyScalar(MIN_Y) );
		points.push( V2.clone().multiplyScalar(MAX_Y) );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var line = new THREE.Line( geometry, material );
	base_propre.add(line);
	
	
	//Z
	var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
	var points = [];
		points.push( V3.clone().multiplyScalar(MIN_Z) );
		points.push( V3.clone().multiplyScalar(MAX_Z) );
	var geometry = new THREE.BufferGeometry().setFromPoints( points );
	var line = new THREE.Line( geometry, material );
	base_propre.add(line);
	
	
	scene.add(base_propre);
	base_propre.visible = false ;
}



//Fonction qui crée la flèche de la normale à la facette
export function cree_normale_facette()
{
	groupeNormale3D = new THREE.Group();
	var normale3D = new THREE.ArrowHelper( new THREE.Vector3( 0, 0, 1 ).normalize(), new THREE.Vector3( 0, 0, 0 ), 1, 0x111111, 0.1, 0.05 ); //Vecteur Direction / Vecteur Origine / Taille / couleur / Longueur tete / diametre tete
	scene.add(normale3D)
	groupeNormale3D.add(normale3D);
	groupeNormale3D.normale3D = normale3D;//pour avoir une référence
	
	var loaderfont = new THREE.FontLoader();
	loaderfont.load( './sources/JS/fonts/helvetiker_regular.typeface.json', function ( font ) {
	
		var geometry = new THREE.TextGeometry( 'n', {
			font: font,
			size: 0.1,
			height: 0.005,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 0.01,
			bevelSize: 0.01,
			bevelOffset: 0,
			bevelSegments: 5
		} );
		var material = new THREE.MeshPhongMaterial( {color: 0x111111 } );
		var labelNormale3D = new THREE.Mesh( geometry, material );
		labelNormale3D.translateZ(0.95);
		labelNormale3D.translateY(-0.2);
		groupeNormale3D.add(labelNormale3D)
		});
	groupeNormale3D.visible = false;
	scene.add(groupeNormale3D);
}

