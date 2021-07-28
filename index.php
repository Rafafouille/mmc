<!DOCTYPE html>
<html lang="fr">
    <head>
        <!-- En-tête de la page -->
        <meta charset="utf-8" />
        <title>MMC</title>
        <meta name="description" content="Illustration en 3D des calculs en mécanique des milieux continus."/>
        
	<link rel="stylesheet" type="text/css" href="sources/style/style.css" />
	
	<script type="text/javascript" src="sources/JS/math.min.js" ></script>
	<!-- <script type="text/javascript" src="sources/JS/three.min.js" ></script> -->
	
	<link rel="stylesheet" type="text/css" href="sources/JS/jquery/jquery-ui.css" />
	<script type="text/javascript" src="sources/JS/jquery/jquery.js" ></script>
	<script type="text/javascript" src="sources/JS/jquery/jquery-ui.js" ></script>
	
	
	<script type="text/javascript" src="sources/JS/fonctions.js" ></script>
	<script type="text/javascript" src="sources/JS/init_math.js" ></script>
	
	<script type="text/javascript" src="sources/JS/easeljs/createjs.min.js"></script>

	<script type="text/javascript" src="sources/JS/easeljs/CLASS-Bipoint.js"></script>
	<script type="text/javascript" src="sources/JS/CLASS-Vecteur.js"></script>


	<script>
	
	
// VARIABLES GLOBALES ===========================================
var scene, camera, renderer, meshRover, quadrillage, axes, base_propre, objet_mecanique;

var mesh_cube_deforme;
var mesh_cube_decoupe;
var geometry_initiale;
var ambientLight, light;
var controls;
var UPDATE_GRAPHISMES=false;
var INTRO=false;	//True si on est dans la phase d'intro
var UPDATE_NORMALE_FROM_MANETTE = false;	// True si on veut que la normale se mette à jour avec la manette
var compteur_UPDATE_NORMALE_FROM_MANETTE = 0;
var t_DEBUT_ANIM ;	//Date du début de l'animation (en s)
var ZOOM_INITIAL = 0.1;	//Zoom de la scene
var test;
var CSG_;
var THREE_;
var material, material_decoupe;
var mesh_masque;
var groupeNormale3D;
var vecteurContrainte3D;
var manette1, manette1bis;
var SESSION_XR=null;
// Cercles de mohr
var stage_Mohr, scene_Mohr, dessin_mohr, cursorCercleDeMohr;
var lastPointMohr = {x:10000000000,y:100000000};
var zoom_Mohr=1;
var oldMousePosition = {x:0,y:0};
var oldScenePosition = {x:0,y:0};


var MIN = -2;
var MAX = 2;
var MIN_X=-2;
var MAX_X=2;
var MIN_Y=-2;
var MAX_Y=2;
var MIN_Z=-2;
var MAX_Z=2;

	</script>
	<script type="module" type="text/javascript" src="sources/JS/init_3D.js" ></script>
	
	<script type="module" type="text/javascript" src="sources/JS/statistiques.js" ></script>
	
    </head>







    <body>
        <!-- Corps de la page -->
        
	<!-- entete ======================= -->
		<header>
				<h1>Illustration des déformations en M.M.C.</h1>
		</header>
        
        
        
    <!-- Options ==================== -->
       <div id="options">
       		<form>
       					<td><input type="checkbox" id="bouton_affiche_quadrillage" name="bouton_affiche_quadrillage" onchange="update_affichage_quadrillage()"></td>
       					<td><label for="bouton_affiche_quadrillage">Afficher le quadrillage</label></td>

       					<td><input type="checkbox" id="bouton_affiche_axes" name="bouton_affiche_axes" checked="" onchange="update_affichage_axes()"></td>
       					<td><label for="bouton_affiche_axes">Afficher les axes</label></td>
 
       					<td><input type="checkbox" id="bouton_affiche_base_propre" name="bouton_affiche_base_propre"  onchange="update_affichage_base_propre()"></td>
       					<td><label for="bouton_affiche_base_propre">Afficher la base propre</label></td>

       					<td><input type="checkbox" id="bouton_affiche_T" name="bouton_affiche_T" onchange="update_affichage_T()"></td>
       					<td><label for="bouton_affiche_T">Afficher le vecteur contrainte</label></td>

       					<td></td>
       					<td><input class="bouton-reset"        type="button"        value="RAZ" onclick="RAZ()";></td>

       		</form>
       </div>
       <script>
			$("#options input:checkbox").checkboxradio();
       </script>
       
      
      <!-- Table pour séparer la feuille droite / gauche -->
       <table style="margin:auto;">
		<tr>
      			<td>	
      
				<!-- 3D ======================= -->
					<div id="visu">
						<span id="message_chargement_fenetre_3D">Chargement...</span>
					</div> 
			</td>
			<td>
			       
				<!-- tenseur Espilon ==================== -->
			       <div class="boite_deroulante" id="tenseurs_epsilon">
			       	<div class="titre_div_deroulant" onclick="$(this).parent().find('.contenu_div_deroulant').slideToggle()" >
			       		Tenseur de déformation <span style="border-bottom: 3px double;">ε</span>
			       	</div>
			       	<div class="contenu_div_deroulant">
						<div style="display:inline;"><span style="border-bottom: 3px double;">ε</span> =</div>
						<div class="tenseur">
							<form>
							<table>
								<tr>
									<td style="border-top:solid">&nbsp;</td>
									<td><input type="number" id="eps_xx" name="eps_xx" size="2" step="0.0001" value="0" title="ε_xx" onchange="update_eps_xx()" /></td>
									<td><input type="number" id="eps_xy" name="eps_xy" size="2" step="0.0001" value="0" title="ε_xy" onchange="update_eps_xy()" /></td>
									<td><input type="number" id="eps_xz" name="eps_xz" size="2" step="0.0001" value="0" title="ε_xz" onchange="update_eps_xz()" /></td>
									<td style="border-top:solid">&nbsp;</td>
								</tr>
								<tr>
									<td>&nbsp;</td>
									<td><input type="number" id="eps_yx" name="eps_yx" size="2" step="0.0001" value="0" title="ε_yx" onchange="update_eps_yx()" /></td>
									<td><input type="number" id="eps_yy" name="eps_yy" size="2" step="0.0001" value="0" title="ε_yy" onchange="update_eps_yy()" /></td>
									<td><input type="number" id="eps_yz" name="eps_yz" size="2" step="0.0001" value="0" title="ε_yz" onchange="update_eps_yz()" /></td>
									<td>&nbsp;</td>
								</tr>
								<tr>
									<td style="border-bottom:solid">&nbsp;</td>
									<td><input type="number" id="eps_zx" name="eps_zx" size=2 step="0.0001" value="0" title="ε_zx" onchange="update_eps_zx()" /></td>
									<td><input type="number" id="eps_zy" name="eps_zy" size=2 step="0.0001" value="0" title="ε_zy" onchange="update_eps_zy()" /></td>
									<td><input type="number" id="eps_zz" name="eps_zz" size=2 step="0.0001" value="0" title="ε_zz" onchange="update_eps_zz()" /></td>
									<td style="border-bottom:solid">&nbsp;</td>
								</tr>
							</table>
							</form>
						</div>
						<br/>
						<form>
							<label for="facteur_exageration_epsilon">Coef. exagération de ε : </label><input id="facteur_exageration_epsilon" name="facteur_exageration_epsilon" type="range" min="1" max="1000" oninput="updateFacteurEpsilon()" value="1000"/>
							(x<span id="indication_exageration_epsilon">1000</span>)
						</form>
					</div>
				</div>
				
				

			       
			    <!-- tenseur Sigma ==================== -->
			       <div class="boite_deroulante" id="tenseurs_sigma">
			       	<div class="titre_div_deroulant" onclick="$(this).parent().find('.contenu_div_deroulant').slideToggle()">
			       		Tenseur de contrainte <span style="border-bottom: 3px double;">σ</span>
			       	</div>
			       	<div class="contenu_div_deroulant">
						<div style="display:inline;"><span style="border-bottom: 3px double;">σ</span> =</div>
						<div class="tenseur">
							<form>
								<table>
									<tr>
										<td style="border-top:solid">&nbsp;</td>
										<td><input type="number" id="sig_xx" name="sig_xx" size="2" step="10" value="0" title="ε_xx" onchange="update_sig_xx()" /></td>
										<td><input type="number" id="sig_xy" name="sig_xy" size="2" step="10" value="0" title="ε_xy" onchange="update_sig_xy()" /></td>
										<td><input type="number" id="sig_xz" name="sig_xz" size="2" step="10" value="0" title="ε_xz" onchange="update_sig_xz()" /></td>
										<td style="border-top:solid">&nbsp;</td>
									</tr>
									<tr>
										<td>&nbsp;</td>
										<td><input type="number" id="sig_yx" name="sig_yx" size="2" step="10" value="0" title="ε_yx" onchange="update_sig_yx()" /></td>
										<td><input type="number" id="sig_yy" name="sig_yy" size="2" step="10" value="0" title="ε_yy" onchange="update_sig_yy()" /></td>
										<td><input type="number" id="sig_yz" name="sig_yz" size="2" step="10" value="0" title="ε_yz" onchange="update_sig_yz()" /></td>
										<td>&nbsp;</td>
									</tr>
									<tr>
										<td style="border-bottom:solid">&nbsp;</td>
										<td><input type="number" id="sig_zx" name="sig_zx" size=2 step="10" value="0" title="ε_zx" onchange="update_sig_zx()" /></td>
										<td><input type="number" id="sig_zy" name="sig_zy" size=2 step="10" value="0" title="ε_zy" onchange="update_sig_zy()" /></td>
										<td><input type="number" id="sig_zz" name="sig_zz" size=2 step="10" value="0" title="ε_zz" onchange="update_sig_zz()" /></td>
										<td style="border-bottom:solid">&nbsp;</td>
									</tr>
								</table>
							</form>
						</div>
						<div> (en MPa)</div>
						<br/>
						<form>
							<label for="facteur_exageration_contrainte">Coef. exagération de σ : </label><input id="facteur_exageration_contrainte" name="facteur_exageration_contrainte" type="range" min="1" max="1000" oninput="updateFacteurContrainte()" value="1000"/>
							<br/>(x<span id="indication_exageration_contrainte">5e-8</span>)
						</form>
					</div>
				</div>
				
				
				
				
				
			    <!-- MATERIAU ==================== -->
				<div class="boite_deroulante"  id="comportement_materiau">
			       	<div class="titre_div_deroulant" onclick="$(this).parent().find('.contenu_div_deroulant').slideToggle()">
			       		Comportement du matériau
			       	</div>
			       	<div class="contenu_div_deroulant">
						<img src="sources/images/RdC.gif" alt="σ=2µε+λtr(ε)I"/>
						<br/>
						<form>
							<table>
								<tr>
									<td style="vertical-align:middle;">
										<label for="coef_lambda"><img src="sources/images/lambda.gif" alt="λ="/></label>
									</td>
									<td>
										<input type="number" id="coef_lambda" name="coef_lambda" value="121.15" onchange="update_from_lambda()"> GPa
									</td>
								</tr>
								<tr>
									<td style="vertical-align:middle;">
										<label for="coef_mu"><img src="sources/images/mu.gif" alt="µ="/></label>
									</td>
									<td>
										<input type="number" id="coef_mu" name="coef_mu" value="80.77" onchange="update_from_mu()"> GPa
									</td>
								</tr>
								<tr>
									<td style="vertical-align:middle;">
										<label for="coef_E"><img src="sources/images/E.gif" alt="E="/></label>
									</td>
									<td>
										<input type="number" id="coef_E" name="coef_E"  step="10" value="210" onchange="update_from_E()"> GPa
									</td>
								</tr>
								<tr>
									<td style="vertical-align:middle;">
										<label for="coef_nu"><img src="sources/images/nu.gif" alt="ν="/></label>
									</td>
									<td>
										<input type="number" id="coef_nu" name="coef_nu" step="0.05" value="0.3" onchange="update_from_nu()">
									</td>
								</tr>
							</table>
						</form>
					</div>
				</div>
				
				
				
				
				
			    <!-- NORMALE ==================== -->
			       <div class="boite_deroulante" id="vecteur_normal">
			       	<div class="titre_div_deroulant" onclick="$(this).parent().find('.contenu_div_deroulant').slideToggle()">
			       		Normale / Vecteur contrainte / Cercle de Mohr
			       	</div>
			       	<div class="contenu_div_deroulant">
				       	<div style="display:inline-block;">
							<div style="display:inline;">n&#8407; =</div>
							<div class="tenseur">
								<form>
									<table>
										<tr>
											<td style="border-top:solid">&nbsp;</td>
											<td><input type="number" id="n_x" name="n_x" size="2" step="0.1" value="1" title="n_x" onchange="updateNormaleVecteurFromNormaleHTML()" /></td>
											<td style="border-top:solid">&nbsp;</td>
										</tr>
										<tr>
											<td>&nbsp;</td>
											<td><input type="number" id="n_y" name="n_y" size="2" step="0.1" value="0" title="n_y" onchange="updateNormaleVecteurFromNormaleHTML()" /></td>
											<td>&nbsp;</td>
										</tr>
										<tr>
											<td style="border-bottom:solid">&nbsp;</td>
											<td><input type="number" id="n_z" name="n_z" size=2 step="0.1" value="0" title="n_z" onchange="updateNormaleVecteurFromNormaleHTML()" /></td>
											<td style="border-bottom:solid">&nbsp;</td>
										</tr>
									</table>
								</form>
							</div>
						</div>
				       	<div style="display:inline-block;">
				       		<button onclick="nRotationX(-math.pi/12)">-Rx</button><button onclick="nRotationX(math.pi/12)">+Rx</button>
				       		<br/>
				       		<button onclick="nRotationY(-math.pi/12)">-Ry</button><button onclick="nRotationY(math.pi/12)">+Ry</button>
				       		<br/>
				       		<button onclick="nRotationZ(-math.pi/12)">-Rz</button><button onclick="nRotationZ(math.pi/12)">+Rz</button>
				       	</div>
				       	
						<div id="cercle_mohr">
							<canvas id="canvas_cercle_mohr" width="500" height="300"></canvas>
							<script type="text/javascript" src="sources/JS/init_cercle_mohr.js" ></script>	
							<br/>
							σ = <span id="affichage_contrainte_normale">0 Pa</span>
							&nbsp;&nbsp;&nbsp;
							τ = <span id="affichage_contrainte_tangentielle">0 Pa</span>
						</div>
			       	</div>
				</div>
				
				
				
			    <!-- VR ==================== -->
			       <div class="boite_deroulante" id="VR">
			       	<div class="titre_div_deroulant" onclick="$(this).parent().find('.contenu_div_deroulant').slideToggle()">
			       		Réalité virtuelle (expérimental)
			       	</div>
			       	<div class="contenu_div_deroulant">
						<div>
				       		<input type="checkbox" id="bouton_update_normale_from_manette" name="bouton_update_normale_from_manette" onchange="update_bouton_normale_from_manette()">
				       		<label for="bouton_update_normale_from_manette">Piloter la normale via les controllers VR</label>
						</div>
						<script>$("#bouton_update_normale_from_manette").checkboxradio();</script>
						<div id="conteneur_bouton_VR">
						</div>
			       	</div>
			       </div>
				
				
				
			    <!-- CREDITS ==================== -->
			       <div class="boite_deroulante" id="credits">
			       	<div class="titre_div_deroulant" onclick="$(this).parent().find('.contenu_div_deroulant').slideToggle()">
			       		À Propos
			       	</div>
			       	<div class="contenu_div_deroulant">
				       	Application web développée par <a href="allais.eu">Raphaël ALLAIS</a>,<br/>
				       	dans le cadre de vacations à l'<a href="https://www.estp.fr/campus-de-dijon">ESTP Paris, campus de Dijon</a>.<br/>
				       	&#9993; : allais.raphael<span class="aarroobbaatt">free.fr</span><br/>
				       	<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">
				       		<img alt="Licence Creative Commons" style="border-width:0" src="sources/images/creative_common.png" />
				       	</a>
			       	</div>
				</div>
				
	
			</td>
		</tr>
	</table>
	
        
    </body>
</html>
