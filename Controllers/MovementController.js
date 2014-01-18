/* MovementController.js
		Este script representa o comportamento de movimentaçao dos personagens. 
	Aqui esta o tratamento de entradas para movimentar o personagem no eixo X.
*/

// Desabilita a tipagem dinamica.
#pragma strict

var speed : float = 1;				// Velocidade do movimento no eixo X.
var minDistance : float = 0.22;		// Distancia minima entre este e o oponente.
var isEnabled : boolean = true;		// Desabilitar o tratamento de entrada?
var invert : boolean = false;		// Inverter controles?

// Direçao de movimento, onde que < 0 e para a esquerda e > 0 e para a direita.
private var direction : float = 0;
// Referencia ao Animator com as animaçoes dos golpes e movimentos do personagem.
private var anim : Animator;

private var floorTag : String;		// Tag que simboliza o chao.
private var rigBody : Rigidbody;	// Referencia ao controlador de fisica.
private var playerTag : String;		// Tag para player.
private var oponent : GameObject;	// Referencia ao oponente.
private var opMovController : MovementController;	// Controlador de movimento do oponente.
private var momentaryDistance : float;		// Distancia atual com o oponente.
private var momentaryMinDistance : float;	// Distancia minima atual com o oponente.
private var momentarySpeed : float = 0;		// Velocidade momentanea.
private var oponentDirection : float = 0;	// Direçao para onde o oponente esta.
private var position : Vector3;				// Posiçao deste personagem.

// Configuraçao inicial.
function Start()
{
	// Adiquire as referencia do Animator e do RigidBody.
	anim = gameObject.GetComponent(Animator);
	rigBody = gameObject.GetComponent(Rigidbody);
	
	// Limita a fisica do personagem, liberando somente o movimento em Y.
	rigBody.constraints = RigidbodyConstraints.FreezeRotation;
	rigBody.constraints |= RigidbodyConstraints.FreezePositionZ | RigidbodyConstraints.FreezePositionX;
	
	// O personagem começa caindo, como se tivesse pulado.
	anim.SetBool("jumping", true);
	
	playerTag = "Player";
	floorTag = "Floor";
	
	position.x = transform.position.x;
	position.y = transform.position.y;
	position.z = transform.position.z;
	
	// Consegue a referencia ao oponente mais proximo.
	getNearestOponent();
}

// Busca a referencia ao oponente mais proximo.
function getNearestOponent()
{
	var oponents : GameObject[];
	var nearest : float;
	var nearestOponent : GameObject;
	var distance : float;
	
	oponent = null;
	nearestOponent = null;
	nearest = float.MaxValue;
	
	oponents = GameObject.FindGameObjectsWithTag(playerTag);
	
	for (var op : GameObject in oponents)
	{
		if (op == gameObject) continue;
		
		distance = Vector3.Distance(op.transform.position, this.transform.position);
		
		if (distance < nearest)
		{
			nearest = distance;
			nearestOponent = op;
		}
	}
	
	oponent = nearestOponent;
	
	opMovController = oponent.GetComponent(MovementController);
}

// Funçao de tratamento de inicio de colisao.
function OnCollisionEnter(collisionInfo : Collision)
{
	// Se o objeto colidido nao for o chao, retorna.
	if (collisionInfo.gameObject.tag != floorTag)
	{
		return;
	}
	else if (anim.GetBool("jumping") == true)
	{
		anim.SetBool("jumping", false);
	}
}

// Funçao de tratamento de colisao.
function OnCollisionStay(collisionInfo : Collision)
{
	
}

// Verifica a direçao para onde esta o oponente e ajusta a direçao deste.
function ajustDirection()
{
	// Caso nao exista a referencia ao oponente, entao e buscada.
	if (oponent == null) getNearestOponent();
	
	// Caso nao haja um oponente na cena, retorna.
	if (oponent == null) return;

	oponentDirection = oponent.transform.position.x - gameObject.transform.position.x;
	
	if (oponentDirection > 0)
	{
		gameObject.transform.localScale.x = 1;
		oponentDirection = 1;
	}
	else
	{
		gameObject.transform.localScale.x = -1;
		oponentDirection = -1;
	}
}

// Move o personagem.
function ajustPosition()
{
	ajustDirection();
	
	momentarySpeed = direction * speed * Time.deltaTime;
	position.x += momentarySpeed;
	position.y = transform.position.y;
	
	// Nao alcançou a distancia minima com o oponente?
	if (!minDistanceFromOponent())
	{
		transform.position.x = position.x;
		return;
	}
	
	// Se o personagem estiver parado...
	if (direction == 0)
	{
		position.x = oponent.transform.position.x;
		position.x += -1 * oponentDirection * (opMovController.minDistance + minDistance);
	}
	else if (direction == oponentDirection)
	{
		position.x = transform.position.x;
		position.x += momentarySpeed + opMovController.momentarySpeed;
	}
	
	transform.position.x = position.x;
}

// A distancia minima com o oponente foi alcançada?
function minDistanceFromOponent() : boolean
{
	// Caso nao exista a referencia ao oponente, entao e buscada.
	if (oponent == null) getNearestOponent();
	
	// Caso nao haja um oponente na cena, retorna.
	if (oponent == null) return;
	
	momentaryDistance = Vector3.Distance(position, oponent.transform.position);
	momentaryMinDistance = momentaryDistance - opMovController.minDistance;
	
	if (momentaryMinDistance >= minDistance) return false;
	else return true;
}

// Procedimento executado a cada loop do jogo. Aqui sao feitos o tratamento de 
//entradas e gerenciamento das animaçoes de movimentaçao.
function Update()
{
	if (isEnabled)
	{
		// A direçao de movimento e setada.
		if (Input.GetButton("left")) direction = -1;
		else if (Input.GetButton("right")) direction = 1;
		else direction = 0;
		
		if (invert) direction *= -1;
	}
	
	// Movimenta o personagem.
	ajustPosition();
	
	// O sinal "direction" do Animator e setado.
	anim.SetFloat("direction", direction);
	
	// O sinal "speed" do Animator e setado.
	anim.SetFloat("speed", Mathf.Abs(direction * speed));
}
