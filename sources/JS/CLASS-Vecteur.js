

//Class vecteur (ce n'est pas une classe graphique)
// __coord__ = Coordonnées du vecteur de la forme {x:,y:}
// __base__ = Référence à un objet easelJS qui sert de référentiel
function Vecteur(__coord__,__base__)
{
	//==========================
	//Variables Membres
	//==========================
	
		this._coord=__coord__;
		this._base=__base__;
		
	
	//==========================
	//getter/setter
	//==========================
	
		//Coordonnées locales *****************
	
		//Coordonnées sur x
		this.dx=function(c)
		{
			if(typeof(c)!='undefined')
					this._coord.dx=c;
			return this._coord.dx;
		}
	
		//Coordonnées sur y
		this.dy=function(c)
		{
			if(typeof(c)!='undefined')
					this._coord.dy=c;
			return this._coord.dy;
		}
		
		//Coordonnées de la forme {dx:dy:}
		this.coord=function(c)
		{
			if(typeof(c)!='undefined')
					this._coord=c;
			return this._coord;
		}
		
		//Coordonnées rammenées en px *****************
		
		//Coord sur X (en px)
		//En setter, on donne les dimensions en px.
		this.DX=function(c)
		{
			if(typeof(c)!='undefined')
					this._coord.dx=c/this.echelle();
			return this._coord.dx*this.echelle();
		}
		//Coord sur Y (en px)
		//En setter, on donne les dimensions en px.
		this.DY=function(c)
		{
			if(typeof(c)!='undefined')
					this._coord.dy=-c/this.echelle();
			return -this._coord.dy*this.echelle();
		}
		//Coordonnées de la forme {dx:dy:}
		this.COORD=function(c)
		{
			if(typeof(c)!='undefined')
			{
					this._coord={dx:c.dx/this.echelle(),dy:-c.dy/this.echelle()};
			}
			return {DX:this.DX(),DY:this.DY()};
		}
		
		
		//Coordonnées globales **********************
		//Get : donne les coordonnées globales du vecteur sur x
		this.dx0=function()
		{
			return this._base.localToGlobal(this.dx(),-this.dy()).x-this._base.localToGlobal(0,0).x;
		}
	
		//Get : donne les coordonnées globales du vecteur sur y
		this.dy0=function(c)
		{
			return -this._base.localToGlobal(this.dx(),-this.dy()).y+this._base.localToGlobal(0,0).y;
		}
		
		//Getter : Coordonnées globale de la forme {dx:dy:}
		//Setter : Affecte les coordonnées local à partir des globales et renvoie les locales
		this.coord0=function(c)
		{
			if(typeof(c)!='undefined')
				{
					this._coord=this._base.globalToLocal(c.dx,-c.dy);
					this.dy(-this.dy())
					return this._coord;
				}
			var cc=this._base.localToGlobal(this.dx(),-this.dy());
			var cc0=this._base.localToGlobal(0,0)
			return {dx:cc.x-cc0.x,dy:-cc.y+cc0.y};
		}
		
		
		// Proprietes *******************************
		//Renvoie la norme du vecteur
		this.norme=function()
		{
			return Math.sqrt(this._coord.dx*this._coord.dx+this._coord.dy*this._coord.dy);
		}
		
		
		//Vecteurs dérivés *****************************
		
		
		
		//Coordonnées du vecteur unitaire (sous la forme {dx:,dy:}
		this.coordUnitaire=function()
		{
			return {dx:this._coord.dx/this.norme(),dy:this._coord.dy/this.norme()};
		}
		
		//Coordonnées du vecteur unitaire normal (sous la forme {dx:,dy:}
		this.coordNormale=function()
		{
			var unit=this.coordUnitaire();
			return {dx:-unit.dy,dy:unit.dx};
		}
		
		//Vecteur unitaire (nouveau vecteur)
		this.unitaire=function()
		{
			return new Vecteur(this.coordUnitaire(),this._base);
		}
		
		//Vecteur normale (nouveau vecteur)
		this.normale=function()
		{
			return new Vecteur(this.coordNormale(),this._base);
		}
		
		//Vecteur ayant subi une rotation d'un angle alpha (en radian) (sous la forme {dx:,dy:}
		this.rotation=function(alpha)
		{
			return {dx:this.dx()*Math.cos(alpha)-this.dy()*Math.sin(alpha),dy:this.dy()*Math.cos(alpha)+this.dx()*Math.sin(alpha)};
		}
		
		//Base ************************
		this.base=function(b)
		{
			if(typeof(b)!='undefined')
				{
					this._base=b
				}
			return this._base;
		}
			
		this.echelle=function()
		{
			return schema.echelle();//En px par unité
		}
		
		
		
	//==========================
	//Autres fonctions membres
	//==========================
	
		//Transforme le vecteur en son vecteur normal.
		this.normalise=function()
		{
			var norme=this.norme();
			this.dx(this.dx()/norme);
			this.dy(this.dy()/norme);
		}
		
		//Fait une rotation au vecteur
		this.tourne=function(alpha)
		{
			this.coord(this.rotation(alpha));
		}
		
		//multiplie le vecteur
		this.multiplie=function(n)
		{
			this.dx(n*this.dx());
			this.dy(n*this.dy());
			return this.coord();
		}
		
		//additionne un autre vecteur
		this.additionne=function(v)
		{
			if(v instanceof Vecteur)
			{
				this.dx(this.dx()+v.dx());
				this.dy(this.dy()+v.dy());
				return this.coord();
			}
			else
			{
				this.dx(this.dx()+v.dx);
				this.dy(this.dy()+v.dy);
				return this.coord();
			}
		}
		
		//Copie
		this.copy=function()
		{
			return new Vecteur(this._coord,this._base)
		}
		
}
