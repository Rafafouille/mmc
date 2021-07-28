

function getDeplacement(X,eps)
{	
	return math.multiply(coeffAffichageDef(),math.multiply(eps,X));
}

function getNewPosition(X,eps)
{
	return math.add(X,getDeplacement(X,eps));
}


function update_geometrie()
{
	mesh_cube_deforme.geometry.vertices[0].x=0.5*(1+epsilon[0][0])
}


// MISE A JOUR EPSILON ===========================================================

function updateFromEpsilonHTML()
{
		epsilon.set([0,0],parseFloat($("#eps_xx").val()));
		epsilon.set([0,1],parseFloat($("#eps_xy").val()));
		epsilon.set([0,2],parseFloat($("#eps_xz").val()));
		epsilon.set([1,0],parseFloat($("#eps_yx").val()));
		epsilon.set([1,1],parseFloat($("#eps_yy").val()));
		epsilon.set([1,2],parseFloat($("#eps_yz").val()));
		epsilon.set([2,0],parseFloat($("#eps_zx").val()));
		epsilon.set([2,1],parseFloat($("#eps_zy").val()));
		epsilon.set([2,2],parseFloat($("#eps_zz").val()));
		
		updateSigmaFromEpsilon(); // Met à jour la matrice sigma...
		updateSigmaHTMLFromSigmaMatrix();// Puis son affichage html
		updateGeometryFromEpsilon();
}


// Fonction qui calcul (et affiche) espilon à partir de sigma
function updateEpsilonFromSigma()
{
	epsilon = math.add(math.multiply((1+nu())/E(), sigma)	,	math.multiply(-nu()/E()*math.trace(sigma) , math.identity(3))  )
}


//Met à jour l'affichage de Epsilon à partir de sa matrice
function updateEpsilonHTMLFromEpsilonMatrix()
{
	$("#eps_xx").val(epsilon.get([0,0]))
	$("#eps_yy").val(epsilon.get([1,1]))
	$("#eps_zz").val(epsilon.get([2,2]))
	
	$("#eps_xy").val(epsilon.get([0,1]))
	$("#eps_yx").val(epsilon.get([1,0]))
	
	$("#eps_xz").val(epsilon.get([0,2]))
	$("#eps_zx").val(epsilon.get([2,0]))
	
	$("#eps_yz").val(epsilon.get([1,2]))
	$("#eps_zy").val(epsilon.get([2,1]))
}

update_eps_xx = updateFromEpsilonHTML;
update_eps_yy = updateFromEpsilonHTML;
update_eps_zz = updateFromEpsilonHTML;

function update_eps_xy()
{
	$("#eps_yx").val( $("#eps_xy").val() );
	updateFromEpsilonHTML();
}
function update_eps_yx()
{
	$("#eps_xy").val( $("#eps_yx").val() );
	updateFromEpsilonHTML()
}

function update_eps_xz()
{
	$("#eps_zx").val( $("#eps_xz").val() );
	updateFromEpsilonHTML();
}
function update_eps_zx(val)
{
	$("#eps_xz").val( $("#eps_zx").val() );
	updateFromEpsilonHTML();
}

function update_eps_yz()
{
	$("#eps_zy").val( $("#eps_yz").val() );
	updateFromEpsilonHTML();
}
function update_eps_zy(val)
{
	$("#eps_yz").val( $("#eps_zy").val() );
	updateFromEpsilonHTML();
}


function updateGeometryFromEpsilon()
{
	for(var i=0 ; i<geometry_initiale.vertices.length ; i++)
	{
		V0 = geometry_initiale.vertices[i];
		V = mesh_cube_deforme.geometry.vertices[i];
		X0 = math.matrix([[V0.x],[V0.y],[V0.z]]);
		newPosition = getNewPosition(X0,epsilon);
		V.x = newPosition.get([0,0]);
		V.y = newPosition.get([1,0]);
		V.z = newPosition.get([2,0]);
	}
	
	// Update du cube découpé
		updateCubeDecoupeFromCubeDeforme()

	UPDATE_GRAPHISMES = true;
}

function updateCubeDecoupeFromCubeDeforme()
{
	var cube_deforme_BSP = new CSG_.ThreeBSP(mesh_cube_deforme);
	var masque_BSP = new CSG_.ThreeBSP(mesh_masque);
	var geometry_cube_decoupe = cube_deforme_BSP.subtract(masque_BSP).toBufferGeometry();
	mesh_cube_decoupe.geometry = geometry_cube_decoupe;
}



function coeffAffichageDef()
{
	return parseFloat($("#facteur_exageration_epsilon").val());
}



// MISE A JOUR SIGMA ===========================================================


function updateFromSigmaHTML()
{
		sigma.set([0,0],parseFloat($("#sig_xx").val())*1000000);
		sigma.set([0,1],parseFloat($("#sig_xy").val())*1000000);
		sigma.set([0,2],parseFloat($("#sig_xz").val())*1000000);
		sigma.set([1,0],parseFloat($("#sig_yx").val())*1000000);
		sigma.set([1,1],parseFloat($("#sig_yy").val())*1000000);
		sigma.set([1,2],parseFloat($("#sig_yz").val())*1000000);
		sigma.set([2,0],parseFloat($("#sig_zx").val())*1000000);
		sigma.set([2,1],parseFloat($("#sig_zy").val())*1000000);
		sigma.set([2,2],parseFloat($("#sig_zz").val())*1000000);
		
		updateEpsilonFromSigma(); // Met à jour la matrice epsilon...
		updateEpsilonHTMLFromEpsilonMatrix();	// Puis son affichage html
		
		updateGeometryFromEpsilon();
		calculeVecteurContrainte()//Mise à jour (math + graphique)
}


//Met à jour l'affichage de Epsilon à partir de sa matrice
function updateSigmaHTMLFromSigmaMatrix()
{
	$("#sig_xx").val(sigma.get([0,0])/1000000)
	$("#sig_yy").val(sigma.get([1,1])/1000000)
	$("#sig_zz").val(sigma.get([2,2])/1000000)
	
	$("#sig_xy").val(sigma.get([0,1])/1000000)
	$("#sig_yx").val(sigma.get([1,0])/1000000)
	
	$("#sig_xz").val(sigma.get([0,2])/1000000)
	$("#sig_zx").val(sigma.get([2,0])/1000000)
	
	$("#sig_yz").val(sigma.get([1,2])/1000000)
	$("#sig_zy").val(sigma.get([2,1])/1000000)
	
}
function updateSigmaFromEpsilon()
{
	sigma = math.add(math.multiply(2*mu() , epsilon)	,	math.multiply(lambda()*math.trace(epsilon) , math.identity(3))  )
	calculeVecteurContrainte();//Mise à jour (math + graphique)
}


update_sig_xx = updateFromSigmaHTML;
update_sig_yy = updateFromSigmaHTML;
update_sig_zz = updateFromSigmaHTML;


function update_sig_xy()
{
	$("#sig_yx").val( $("#sig_xy").val() );
	updateFromSigmaHTML();
}
function update_sig_yx()
{
	$("#sig_xy").val( $("#sig_yx").val() );
	updateFromSigmaHTML()
}

function update_sig_xz()
{
	$("#sig_zx").val( $("#sig_xz").val() );
	updateFromSigmaHTML();
}
function update_sig_zx(val)
{
	$("#sig_xz").val( $("#sig_zx").val() );
	updateFromSigmaHTML();
}

function update_sig_yz()
{
	$("#sig_zy").val( $("#sig_yz").val() );
	updateFromSigmaHTML();
}
function update_sig_zy(val)
{
	$("#sig_yz").val( $("#sig_zy").val() );
	updateFromSigmaHTML();
}


function coeffAffichageContrainte()
{
	return 5e-11*parseFloat($("#facteur_exageration_contrainte").val());
}


// MISE A JOUR normale ==========================================================

// Met à jour l'affichage HTML de la normale à partir du vecteur
function updateNormaleHTMLFromNormaleVecteur()
{
	$("#n_x").val(normale.get([0,0]));
	$("#n_y").val(normale.get([1,0]));
	$("#n_z").val(normale.get([2,0]));
}

// Met à jour la normale à partir du vecteur HTML (et met à jour les graphisme)
function updateNormaleVecteurFromNormaleHTML()
{
	var nx =parseFloat($("#n_x").val());
	var ny =parseFloat($("#n_y").val());
	var nz =parseFloat($("#n_z").val()) ;
	normale.set([0,0],nx)
	normale.set([1,0],ny)
	normale.set([2,0],nz)
	var normee = Math.sqrt(nx*nx+ny*ny+nz*nz)
	normale=math.multiply(normale,1/normee);
	
	
	//Update des graphismes
	updateNormaleGraphiqueFromVecteurNormale();
	//Update Cercle de Mohr
	dessineActuelPointCercleDeMohr()
}

// Met à jour la normale à partir du vecteur HTML (et met à jour les graphisme)
function udpateNormaleVecteurFromControlleurVR()
{
	var n1 = manette1.localToWorld(new THREE_.Vector3(0.,0.,1.));
	var n0 = manette1.localToWorld(new THREE_.Vector3(0.,0.,0.));
	var n = n1.sub(n0);
	
	
	
	normale.set([0,0],-n.x)
	normale.set([1,0],-n.y)
	normale.set([2,0],-n.z)
	// Update l'affichage HTML
	updateNormaleHTMLFromNormaleVecteur();
	//Update des graphismes
	updateNormaleGraphiqueFromVecteurNormale();
	//Update Cercle de Mohr
	dessineActuelPointCercleDeMohr()
}

function update_bouton_normale_from_manette()
{
	UPDATE_NORMALE_FROM_MANETTE = $("#bouton_update_normale_from_manette").prop('checked')
}

// Met à jour le graphisme (normale + cache) à partir de la normale
function updateNormaleGraphiqueFromVecteurNormale()
{
	//Récupere les coordonnées
	nx = normale.get([0,0])
	ny = normale.get([1,0])
	nz = normale.get([2,0])
	
	//Update l'affichage de la facette en faisant tourner le cache
	// La suite est récupérée dans https://stackoverflow.com/questions/32849600/direction-vector-to-a-rotation-three-js
	var mx = new THREE_.Matrix4().lookAt(new THREE_.Vector3(nx,ny,nz),new THREE_.Vector3(0,0,0),new THREE_.Vector3(0,1,0));
	var qt = new THREE_.Quaternion().setFromRotationMatrix(mx);

	mesh_masque.rotation.setFromQuaternion(qt);
	updateCubeDecoupeFromCubeDeforme();
	
	//Update l'affichage de la normale
	groupeNormale3D.rotation.setFromQuaternion(qt);
	
	//Update de l'affichage de la contrainte
	calculeVecteurContrainte();
}



function faitTournerN(matRot)
{
	normale = math.multiply(matRot,normale);
	updateNormaleHTMLFromNormaleVecteur();
	updateNormaleGraphiqueFromVecteurNormale();
	dessineActuelPointCercleDeMohr();
}

function nRotationX(theta)
{
	var rot= math.matrix([[1,0,0],[0,math.cos(theta),-math.sin(theta)],[0,math.sin(theta),math.cos(theta)]]) ;
	faitTournerN(rot);
}
function nRotationY(theta)
{
	var rot= math.matrix([[math.cos(theta),0,math.sin(theta)],[0,1,0],[-math.sin(theta),0,math.cos(theta)]]) ;
	faitTournerN(rot);
}
function nRotationZ(theta)
{
	var rot= math.matrix([[math.cos(theta),-math.sin(theta),0],[math.sin(theta),math.cos(theta),0],[0,0,1]]) ;
	faitTournerN(rot);
}




// AUTRE ===========================================================

function update_affichage_quadrillage()
{
	quadrillage.visible=$("#bouton_affiche_quadrillage").prop('checked')
}

function update_affichage_axes()
{
	axes.visible=$("#bouton_affiche_axes").prop('checked')
}

function update_affichage_base_propre()
{
	base_propre.visible=$("#bouton_affiche_base_propre").prop('checked')
}

//Fonction qui cacule le vecteur contrainte
function calculeVecteurContrainte()
{
	vecteurContrainte = math.multiply(sigma,normale);
	var T_Three = new THREE_.Vector3(vecteurContrainte.get([0,0]),vecteurContrainte.get([1,0]),vecteurContrainte.get([2,0]));
	var norme = T_Three.length();
	T_Three.normalize();
	vecteurContrainte3D.setDirection(T_Three);
	vecteurContrainte3D.setLength(norme*coeffAffichageContrainte());
}

function update_affichage_T()
{
	if($("#bouton_affiche_T").prop('checked'))
	{
		updateNormaleVecteurFromNormaleHTML(); //On met à jour un petit coup avant d'afficher
		calculeVecteurContrainte();
		mesh_cube_decoupe.visible = true ;
		mesh_cube_deforme.material.opacity = 0.3 ;
		groupeNormale3D.visible = true ;
		vecteurContrainte3D.visible = true;
	}
	else
	{
		mesh_cube_decoupe.visible = false ;
		mesh_cube_deforme.material.opacity = 1 ;
		groupeNormale3D.visible = false ;
		vecteurContrainte3D.visible = false;
	}
}

// Remet le tenseur à 0
function RAZ()
{
//	if($("#bouton_HPP").prop('checked'))
//	{
		$("#eps_xx").val(0);
		$("#eps_yy").val(0);
		$("#eps_zz").val(0);
		$("#eps_xy").val(0);
		$("#eps_yx").val(0);
		$("#eps_xz").val(0);
		$("#eps_zx").val(0);
		$("#eps_yz").val(0);
		$("#eps_zy").val(0);
	updateFromEpsilonHTML();
}


// COEFFICIENTS ========================================================

// Getter/Setter de E (stocké dans le input en GPa)
function E(_E_)
{
	if(typeof(_E_)!="undefined")
	{
		$("#coef_E").val((_E_/1000000000).toFixed(2));
		return _E_;
	}
	return parseFloat($("#coef_E").val())*1000000000;
}
// Getter/Setter de lambda (stocké dans le input en GPa)
function lambda(_l_)
{
	if(typeof(_l_)!="undefined")
	{
		$("#coef_lambda").val((_l_/1000000000).toFixed(2));
		return _l_;
	}
	return parseFloat($("#coef_lambda").val())*1000000000;
}
// Getter/Setter de mu (stocké dans le input en GPa)
function mu(_m_)
{
	if(typeof(_m_)!="undefined")
	{
		$("#coef_mu").val((_m_/1000000000).toFixed(2));
		return _m_;
	}
	return parseFloat($("#coef_mu").val())*1000000000;
}
// Getter/Setter de nu (stocké dans le input)
function nu(_n_)
{
	if(typeof(_n_)!="undefined")
	{
		$("#coef_nu").val(_n_.toFixed(2));
		return _n_;
	}
	return parseFloat($("#coef_nu").val());
}




//Lit la valeur de nu (coef de poisson) dans le formulaire, recalcule lambda et mu et met à jour le reste
function update_from_nu()
{-42
	mu(E()/(2*(1+nu())));
	lambda(E()*nu()/((1+nu())*(1-2*nu()))) ;
	updateEpsilonFromSigma();
	updateEpsilonHTMLFromEpsilonMatrix();	// Puis son affichage html
	updateGeometryFromEpsilon();
}
//Idem pour E
update_from_E = update_from_nu;

//Lit la valeur de lambda (coef de poisson) dans le formulaire, recalcule E et nu et met à jour le reste
function update_from_lambda()
{
	E(mu()*(3*lambda()+2*mu())/(lambda()+mu()))
	nu(lambda()/(2*lambda()+mu()))
	updateEpsilonFromSigma();
	updateEpsilonHTMLFromEpsilonMatrix();	// Puis son affichage html
	updateGeometryFromEpsilon();
}
//Idem pour mu
update_from_mu = update_from_lambda;




function updateFacteurEpsilon()
{
	$("#indication_exageration_epsilon").text(coeffAffichageDef());
	updateGeometryFromEpsilon();
}

function updateFacteurContrainte()
{
	$("#indication_exageration_contrainte").text(coeffAffichageContrainte());
	calculeVecteurContrainte();
}




// CERCLES DE MOHR ========================================================

function getContrainteNormale()
{
	return math.dot(vecteurContrainte,normale)
}

function getContrainteTangeantielle()
{
	var tau = math.subtract(vecteurContrainte, math.multiply(getContrainteNormale(),normale))
	return math.norm(math.transpose(tau)._data[0])
}


// Dessine un point sur la graphique du cercle de mohr.
// x et y en MPa
function ajoutePointCercleDeMohr(x,y)
{
	var circle = new createjs.Shape();
	
	cursorCercleDeMohr.x = x * zoom_Mohr ;
	cursorCercleDeMohr.y = -y * zoom_Mohr ;
	
	circle.graphics.beginFill("red").drawCircle(0, 0, 3);
	circle.x = x * zoom_Mohr ;
	circle.y = -y * zoom_Mohr ;
	dessin_mohr.addChild(circle);
	stage_Mohr.update();
	lastPointMohr.x=x; //Sauvegarde les dernières coordonnées.
	lastPointMohr.y=y;
}

// Dessine LE point actuel (à partir de sigma et de n) sur le cercle de mohr
// DistMin empeche de dessiner si le point est proche (au sens de distMin) du précédent.
// Les coordonnées du nouveau point sont mis à jour dans 
function dessineActuelPointCercleDeMohr(distMin=1)
{
	var x=getContrainteNormale()/1000000;
	var y=getContrainteTangeantielle()/1000000;
	if( (x-lastPointMohr.x)*(x-lastPointMohr.x)+(y-lastPointMohr.y)*(y-lastPointMohr.y) >= distMin*distMin/scene_Mohr.scaleX/scene_Mohr.scaleX )
		ajoutePointCercleDeMohr(x,y);
}

function redessineAxesMohr()
{
	// On replace les axes dans le cadre de l'image
	scene_Mohr.axes.axeX.x = -scene_Mohr.x+250//(1-facteur)*(posScene.x-posSouris.x);
	scene_Mohr.axes.axeY.y = -scene_Mohr.y+150//(1-facteur)*(posScene.y-posSouris.y);
	
	
	scene_Mohr.axes.axeX.grad.removeAllChildren();
	scene_Mohr.axes.axeY.grad.removeAllChildren();
	

	
	// a l'échelle 1 : 1px = 1MPa
	
	var niveauZoom = Math.floor(Math.log10(zoom_Mohr*1.8)); // Le *1.8 sert à décaller le niveau (que ça bascule pas d'un niveau à l'autre trop tot dans le zoom)
	var unite1 = zoom_Mohr/Math.pow(10,niveauZoom-1);
	var unite2 = zoom_Mohr/Math.pow(10,niveauZoom);
	
	//graduactions sur x
	var gradxMin = Math.floor(-scene_Mohr.x/unite1)*unite1
	gradxMin -= scene_Mohr.axes.axeX.x // Car c'est dessiné dans le référentiel de l'axe, et non de la scene
	var gradxMax = Math.floor((500-scene_Mohr.x)/unite1)*unite1+unite1
	gradxMax -= scene_Mohr.axes.axeX.x // idem
	
	for(xx = gradxMin ; xx <= gradxMax ; xx+=unite1)
	{
		var ligne = new createjs.Shape();
		if(  Math.round(((xx+scene_Mohr.axes.axeX.x)/unite1))%10     )//Multiple de 10
		{
			var epaisseur = 1;
			var couleur = "#EEEEEE";
		}
		else
		{
			var epaisseur = 2;
			var couleur = "#AAAAAA";
		}
		ligne.graphics.setStrokeStyle(epaisseur).beginStroke(couleur).moveTo(xx,-100000).lineTo(xx,100000);
		scene_Mohr.axes.axeX.grad.addChild(ligne);
	}
	
	//Graduations sur y
	var gradyMin = Math.floor(-scene_Mohr.y/unite1)*unite1
	gradyMin -= scene_Mohr.axes.axeY.y // Car c'est dessiné dans le référentiel de l'axe, et non de la scene
	var gradyMax = Math.floor((300-scene_Mohr.y)/unite1)*unite1+unite1
	gradyMax -= scene_Mohr.axes.axeY.y // idem
	
	for(yy = gradyMin ; yy <= gradyMax ; yy+=unite1)
	{
		var ligne = new createjs.Shape();
		if(  Math.round(((yy+scene_Mohr.axes.axeY.y)/unite1))%10     )//Multiple de 10
		{
			var epaisseur = 1;
			var couleur = "#EEEEEE";
		}
		else
		{
			var epaisseur = 2;
			var couleur = "#AAAAAA";
		}
		ligne.graphics.setStrokeStyle(epaisseur).beginStroke(couleur).moveTo(-100000,yy).lineTo(100000,yy);
		scene_Mohr.axes.axeY.grad.addChild(ligne);
	}
}

