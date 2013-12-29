#pragma strict

var anim : Animator;

function Start()
{
	anim = gameObject.GetComponent(Animator);
}

function Update()
{
	if (Input.GetButtonDown("Fire1"))
	{
		anim.SetBool("punch", true);
	}
	else anim.SetBool("punch", false);
}