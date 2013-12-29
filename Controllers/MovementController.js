#pragma strict

var speed : float = 5;
var direction : float = 0;
var anim : Animator;

function Start()
{
	anim = gameObject.GetComponent(Animator);
}

function Update()
{
	direction = Input.GetAxis("Horizontal") * Time.deltaTime;
	
	transform.position.x += direction;
	
	anim.SetFloat("direction", direction);
	
	anim.SetFloat("speed", Mathf.Abs(Input.GetAxis("Horizontal")));
}