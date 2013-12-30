/* MovementController.js
		Este script representa o comportamento de combate dos personagens. Aqui
	estao os procedimentos de detecçao de colisao e configuraçao dos sinais usados
	no Animator para começar e terminar as animaçoes de golpes.
*/

// Desabilita a tipagem dinamica.
#pragma strict

// Velocidade do movimento no eixo X.
var speed : float = 5;
// Direçao de movimento, onde que < 0 e para a esquerda e > 0 e para a direita.
var direction : float = 0;
// Referencia ao Animator com as animaçoes dos golpes e movimentos do personagem.
var anim : Animator;

// Configuraçao inicial.
function Start()
{
	anim = gameObject.GetComponent(Animator);
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