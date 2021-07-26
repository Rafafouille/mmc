//Au choix :
// __p1__ et __p2__ sont des points {x:,y:}


var Bipoint = function(__p1__,__p2__)
{
	//==========================
	//Constructeur issu de l'heritage
	//==========================

		createjs.Container.call(this);
		

	//==========================
	//Variables Membres
	//==========================
	
		this._p1=__p1__;	//Coordonnées du points 1 (exprimé dans la base du schéma)
		this._p2=__p2__;	//Coordonnées du points 2 (exprimé dans la base du schéma)
		this._vecteur=new Vecteur({dx:this._p2.x-this._p1.x,dy:this._p2.y-this._p1.y})
		
		this._LONGUEURFleche=10;	//Longueur du bout de la fleche, en pixel
		this._LARGEURFleche=5;	//Largeur du bout de la fleche, en pixel
		this._LARGEURTrait=3;
		this._couleur="black";	//Couleur de la fleche

	//==========================
	//getter/setter
	//==========================

		//Getter/Setter de P1
		this.p1=function(p)
		{
			if(typeof(p)!='undefined')
			{
				this._p1=p;
				this.updateVecteurFromPoints();
				this.updateDessin();
			}
			return this._p1;
		}

		//Getter/Setter de P2
		this.p2=function(p)
		{
			if(typeof(p)!='undefined')
			{
				this._p2=p;
				this.updateVecteurFromPoints();
				this.updateDessin();
			}
			return this._p2;
		}
		
		//Getter/Setter du vecteur
		this.vecteur=function(v)
		{
			if(typeof(v)!='undefined')
			{
				this._vecteur=v;
				this.updatePointsFromVecteur();
				this.updateDessin();
			}
			return this._vecteur;
		}

		//Getter/Setter de la coordonnées sur x (dans la base de schema) du point 1
		this.x1=function(x)
		{
			if(typeof(x)!='undefined')
			{
				this._p1.x=x;
				this.updateDessin();
			}
			return this._p1.x;
		}

		//Getter/Setter de la coordonnées sur y (dans la base de schema) du point 1
		this.y1=function(y)
		{
			if(typeof(y)!='undefined')
			{
				this._p1.y=y;
				this.updateDessin();
			}
			return this._p1.y;
		}
		
		//Getter/Setter de la coordonnées sur x (dans la base de schema) du point 2
		this.x2=function(x)
		{
			if(typeof(x)!='undefined')
			{
				this._p2.x=x;
				this.updateDessin();
			}
			return this._p2.x;
		}

		//Getter/Setter de la coordonnées sur y (dans la base de schema) du point 2
		this.y2=function(y)
		{
			if(typeof(y)!='undefined')
			{
				this._p2.y=y;
				this.updateDessin();
			}
			return this._p2.y;
		}
		
		
		//norme de la fleche (dans la base de schema)
		this.norme=function()
		{
			return this._vecteur.norme();
		}		
		
		
		


		
		//Getter/Setter de la couleur
		this.couleur=function(c)
		{
			if(typeof(c)!='undefined')
			{
				this._couleur=c;
				this._tige.graphics._stroke.style=c;
				this._bout.graphics._fill.style=c;
			}
			return this._couleur;
		}
	//==========================
	//Autres fonctions membres
	//==========================

		this.updateDessin=function()
		{
				//Update tige
				this._tige.graphics._activeInstructions[0].x=this.x1();
				this._tige.graphics._activeInstructions[0].y=this.y1();
				this._tige.graphics._activeInstructions[1].x=this.x2();
				this._tige.graphics._activeInstructions[1].y=this.y2();
				//Update fleche
				this._bout.graphics._activeInstructions[0].x=this.x2();
				this._bout.graphics._activeInstructions[0].y=this.y2();
				this._bout.graphics._activeInstructions[1].x=this.x2()-this._vecteur.coordUnitaire().dx*this._LONGUEURFleche-this._vecteur.coordNormale().dx*this._LARGEURFleche;
				this._bout.graphics._activeInstructions[1].y=this.y2()+this._vecteur.coordUnitaire().dy*this._LONGUEURFleche+this._vecteur.coordNormale().dy*this._LARGEURFleche;
				this._bout.graphics._activeInstructions[2].x=this.x2()-this._vecteur.coordUnitaire().dx*this._LONGUEURFleche+this._vecteur.coordNormale().dx*this._LARGEURFleche;
				this._bout.graphics._activeInstructions[2].y=this.y2()+this._vecteur.coordUnitaire().dy*this._LONGUEURFleche-this._vecteur.coordNormale().dy*this._LARGEURFleche;
		}
		
		//Met à jour l'objet vecteur en fonction des points
		this.updateVecteurFromPoints=function()
		{
			var dx=this._p2.x-this._p1.x;
			var dy=this._p2.y-this._p1.y;
			this._vecteur.coord({dx:dx,dy:dy});
		}
		
		//Met à jour l'objet le point P2 en fonction de P1 et du vecteur
		this.updatePointFromVecteur=function()
		{
			this._p2.x=this._p1.x+this._vecteur.dx();
			this._p2.y=this._p1.y+this._vecteur.dy();
		}
		
		


	//==========================
	//Graphismes
	//==========================
			//Dessin de la tige
			this._tige= new createjs.Shape();
			this._tige.graphics.setStrokeStyle(this._LARGEURTrait).beginStroke(this._couleur).moveTo(this.x1(),this.y1()).lineTo(this.x2(),this.y2());
			this.addChild(this._tige);
			
			//Dessin du bout de la fleche
			this._bout= new createjs.Shape();
			this._bout.graphics.beginFill(this._couleur)
				.moveTo(this.x2(),this.y2())
				.lineTo(this.x2()-this._vecteur.coordUnitaire().dx*this._LONGUEURFleche-this._vecteur.coordNormale().dx*this._LARGEURFleche,	this.y2()-this._vecteur.coordUnitaire().dy*this._LONGUEURFleche-this._vecteur.coordNormale().dy*this._LARGEURFleche)
				.lineTo(this.x2()-this._vecteur.coordUnitaire().dx*this._LONGUEURFleche+this._vecteur.coordNormale().dx*this._LARGEURFleche,	this.y2()-this._vecteur.coordUnitaire().dy*this._LONGUEURFleche+this._vecteur.coordNormale().dy*this._LARGEURFleche);//Note cela prend l'inversion de l'axe Y
			this.addChild(this._bout);



}
Bipoint.prototype = Object.create(createjs.Container.prototype);//On recopie le prototype de createjs.Stage
Bipoint.prototype.constructor = Bipoint;//On recopie le constructeur de Noeud dans son prototype



