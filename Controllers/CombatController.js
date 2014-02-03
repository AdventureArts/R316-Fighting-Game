/* CombatController.js
		Este script representa o comportamento de combate dos personagens. Aqui
	estao os procedimentos de detecçao de colisao e configuraçao dos sinais usados
	no Animator para começar e terminar as animaçoes de golpes.
*/

// Desabilita a tipagem dinamica.
#pragma strict

private var idleName : String;			// Nome do estado ocioso.
private var idleNameHash : int;			// "Codigo" do estado ocioso.
private var movingName : String;		// Nome do estado "movendo-se".
private var movingNameHash : int;		// "Codigo" do estado "movendo-se".
private var hitTag : String;			// Tag para estado de detecçao de colisao
private var hitTagHash : int;
private var playerTag : String;			// Tag para player.
private var lastStateNameHash : int;	// Guarda a "Codigo" do nome do ultimo estado.
private var currentStateNameHash : int;	// Guarda a "Codigo" do nome do estado atual.
private var lastCollisionStateNameHash : int;	// Guarda a "Codigo" do nome do ultimo estado para detecçao de colisao.
private var anim : Animator;	// Referencia ao Animator com as animaçoes dos golpes e movimentos do personagem.
private var beating : boolean;			// Este personagem esta batendo?
private var opCombatController : CombatController;	// Referencia do controlador de combate do oponente.
private var gotHitStateNames : String[];	// Nome dos estados de reaçoes a golpes.
private var gotHitStateHashes : int[];	// "Codogo" dos estados de reaçoes a golpes.

var desable : boolean;		// O tratamento de entradas acontecera?

// Tipos de golpes existentes.
enum HitTypes
{
	faceHit		// Golpe no rosto.
};

// Configuraçao inicial.
function Start()
{
	Debug.Log("Estou controlando " + gameObject.name);
	
	// Referencia ao Animator usado por este objeto.
	anim = gameObject.GetComponent(Animator);
	
	// Nome e "Codigo" do estado ocioso.
	idleName = "Base Layer.idle";
	idleNameHash = Animator.StringToHash(idleName);
	
	// Nome e "Codigo" do estado "movendo-se".
	movingName = "Base Layer.walking";
	movingNameHash = Animator.StringToHash(movingName);
	
	// Tag para os estados que solicitam tratamento de golpes.
	hitTag = "HitDetection";
	hitTagHash = Animator.StringToHash(hitTag);
	
	// Tag que identifica outro jogador.
	playerTag = "Player";
	
	// Podemos assumir que o primeiro e ultimo estados acionados sao nulos.
	lastStateNameHash = 0;
	currentStateNameHash = 0;
	
	lastCollisionStateNameHash = 0;
	
	// O personagem nao começa batendo.
	beating = false;
	
	gotHitStateNames = new String[1];
	gotHitStateHashes = new int[1];
	
	gotHitStateNames[0] = "faceHit";
	
	for (var i : int = 0; i < 1; i++)
	{
		gotHitStateHashes[i] = Animator.StringToHash("Base Layer." + gotHitStateNames[i]);
	}
}

// Funçao do tipo get, que retorna se o personagem esta batendo ou nao.
function isBeating() : boolean
{
	return beating;
}

// Atualiza os codigos de atual e ultima estados visitados.
function updateStatePointers()
{
	if (anim == null) return;
	if (currentStateNameHash == anim.GetCurrentAnimatorStateInfo(0).nameHash) return;

	lastStateNameHash = currentStateNameHash;
	currentStateNameHash = anim.GetCurrentAnimatorStateInfo(0).nameHash;
}

// Funçao que desabilita todos os sinais de golpes.
function setInitialHitSignals()
{
	updateStatePointers();

	for (var i : int = 0; i < 1; i++)
	{
		if (currentStateNameHash == gotHitStateHashes[i])
		{
			anim.SetBool(gotHitStateNames[i], false);
		}
	}

	if (currentStateNameHash == idleNameHash && lastStateNameHash != movingNameHash)
	{
		beating = false;
	}
	else return;

	anim.SetBool("punch", false);
	anim.SetBool("upperKick", false);
}

function gotHit(hitType : HitTypes)
{
	if (hitType == HitTypes.faceHit)
	{
		anim.SetBool("faceHit", true);
	}
}

// Funçao que trata as colisoes e aplica o golpe adequado.
function collisionDetection(collision : Collision)
{
	// Se nao estiver num estado de detecçao de colisao, entao retorna.
	if (anim.GetCurrentAnimatorStateInfo(0).tagHash != hitTagHash)
	{
		lastCollisionStateNameHash = 0;
		return;
	}
	
	// Caso o objeto impactado seja de tag Player, entao o golpe e aplicado.
	if (collision.gameObject.tag == playerTag)
	{
		// Caso esteja duplicando o golpe num mesmo estado, retorna.
		if (anim.GetCurrentAnimatorStateInfo(0).nameHash == lastCollisionStateNameHash)
		{
			return;
		}
		else
		{
			lastCollisionStateNameHash = anim.GetCurrentAnimatorStateInfo(0).nameHash;
		}
		
		Debug.Log("Pow " + lastCollisionStateNameHash);
		
		opCombatController = collision.gameObject.GetComponent(CombatController);
		
		if (opCombatController != null) opCombatController.gotHit(HitTypes.faceHit);
	}
}

// Funçao de tratamento de inicio de colisao.
function OnCollisionEnter(collisionInfo : Collision)
{
	collisionDetection(collisionInfo);
}

// Funçao de tratamento de colisao.
function OnCollisionStay(collisionInfo : Collision)
{
	collisionDetection(collisionInfo);
}

// Procedimento executado a cada loop do jogo. Aqui sao feitos o tratamento de 
//entradas e gerenciamento das animaçoes de golpes.
function Update()
{
	// Volta para o estado inicial.
	setInitialHitSignals();

	if (desable) return;

	// Teste temporario para procedimento de golpe generico.
	if (Input.GetButtonDown("Fire1"))
	{
		anim.SetBool("punch", true);
		beating = true;
	}
	else if (Input.GetButtonDown("Fire2"))
	{
		anim.SetBool("upperKick", true);
		beating = true;
	}
}