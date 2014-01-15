/* MovementController.js
		Este script representa o comportamento de movimentaçao dos personagens. 
	Aqui esta o tratamento de entradas para movimentar o personagem no eixo X.
*/

// Desabilita a tipagem dinamica.
#pragma strict

// Velocidade do movimento no eixo X.
var speed : float = 5;
// Direçao de movimento, onde que < 0 e para a esquerda e > 0 e para a direita.
var direction : float = 0;
// Referencia ao Animator com as animaçoes dos golpes e movimentos do personagem.
var anim : Animator;
// Tag que simboliza o chao.
var floorTag : String;
// Referencia ao controlador de fisica.
var rigBody : Rigidbody;

// Configuraçao inicial.
function Start()
{
	// Adiquire as referencia do Animator e do RigidBody.
	anim = gameObject.GetComponent(Animator);
	rigBody = gameObject.GetComponent(Rigidbody);
	
	// Limita a fisica do personagem para o 2D.
	rigBody.constraints = RigidbodyConstraints.FreezeRotation | RigidbodyConstraints.FreezePositionZ;
	
	// O personagem começa caindo, como se tivesse pulado.
	anim.SetBool("jumping", true);
	
	floorTag = "Floor";
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

// Procedimento executado a cada loop do jogo. Aqui sao feitos o tratamento de 
//entradas e gerenciamento das animaçoes de movimentaçao.
function Update()
{
	// A direçao de movimento e setada.
	direction = Input.GetAxis("Horizontal") * Time.deltaTime;
	
	// A posiçao do personagem e atualizada.
	transform.position.x += direction;
	
	// O sinal "direction" do Animator e setado.
	anim.SetFloat("direction", direction);
	
	// O sinal "speed" do Animator e setado.
	anim.SetFloat("speed", Mathf.Abs(Input.GetAxis("Horizontal")));
}
