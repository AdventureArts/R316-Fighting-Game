/* CombatController.js
		Este script representa o comportamento de combate dos personagens. Aqui
	estao os procedimentos de detecçao de colisao e configuraçao dos sinais usados
	no Animator para começar e terminar as animaçoes de golpes.
*/

// Desabilita a tipagem dinamica.
#pragma strict

// Tag para estado de detecçao de colisao
var hitTag : String;
var hitTagHash : int;

// Tag para player.
var playerTag : String;

// Referencia ao Animator com as animaçoes dos golpes e movimentos do personagem.
var anim : Animator;

// Configuraçao inicial.
function Start()
{
	Debug.Log("Estou controlando " + gameObject.name);
	
	anim = gameObject.GetComponent(Animator);
	
	hitTag = "HitDetection";
	hitTagHash = Animator.StringToHash(hitTag);
	
	playerTag = "Player";
}

// Funçao que desabilita todos os sinais de golpes.
function clearInitialHitSignals()
{
	anim.SetBool("punch", false);
}

// Funçao que trata as colisoes e aplica o golpe adequado.
function collisionDetection(collision : Collision2D)
{
	// Se nao estiver num estado de detecçao de colisao, entao retorna.
	if (anim.GetCurrentAnimatorStateInfo(0).tagHash != hitTagHash)
	{
		return;
	}
	
	// Caso o objeto impactado seja de tag Player, entao o golpe e aplicado.
	if (collision.gameObject.tag == playerTag)
	{
		//
	}
	
	// Volta para o estado inicial.
	clearInitialHitSignals();
}

// Funçao de tratamento de colisao.
function OnCollisionStay2D(collisionInfo : Collision2D)
{
	collisionDetection(collisionInfo);
}

// Funçao de tratamento de inicio de colisao.
function OnCollisionEnter2D(collisionInfo : Collision2D)
{
	collisionDetection(collisionInfo);
}


// Procedimento executado a cada loop do jogo. Aqui sao feitos o tratamento de 
//entradas e gerenciamento das animaçoes de golpes.
function Update()
{
	// Teste temporario para procedimento de golpe generico.
	if (Input.GetButtonDown("Fire1"))
	{
		anim.SetBool("punch", true);
	}
}