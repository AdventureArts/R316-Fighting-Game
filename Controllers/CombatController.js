/* CombatController.js
		Este script representa o comportamento de combate dos personagens. Aqui
	estao os procedimentos de detecçao de colisao e configuraçao dos sinais usados
	no Animator para começar e terminar as animaçoes de golpes.
*/

// Desabilita a tipagem dinamica.
#pragma strict

// Referencia ao Animator com as animaçoes dos golpes e movimentos do personagem.
var anim : Animator;

// Configuraçao inicial.
function Start()
{
	anim = gameObject.GetComponent(Animator);
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
	else anim.SetBool("punch", false);
}