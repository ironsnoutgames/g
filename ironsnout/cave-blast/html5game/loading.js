//	
//	Custom Game Loading
//	
var fakeCentTarget 	= 1;
var fakeCent		= 1;			

var lerpSpd 		= 0.02;
var bodyLoad		= false;
var loadingDone		= false;
var fakeLoading, bulletSpawn, bulletCheck;

var clonePos = 0;
var bulletSpeed = 3;
var bulletMaxDist = 512;
var charAngle = 0;

var bar, fill, proc, scene, bullet, shooter, enemy, hitTemplate;

var bullets = [];
var hits = [];

function loading_start() {

	bar	 = document.getElementById("bar");
	fill = document.getElementById("fill");
	proc = document.getElementById("proc");	
	bullet = document.getElementById("bullet");
	hitTemplate = document.getElementById("hit");
	scene = document.getElementById("scene");	
	shooter = document.getElementById("shooter");	
	enemy = document.getElementById("enemy");	
	
	bulletMaxDist = enemy.getBoundingClientRect().left - shooter.getBoundingClientRect().right + 70;
	
	var bulletSpawn = setInterval(function() {
		loading_spawn_bullet();
	}, 500);		
	
	var bulletCheck = setInterval(function() {
		for (var i = bullets.length - 1; i >= 0; i--) {
			var bull = bullets[i];
			bull.dist += bulletSpeed;
			bull.x += Math.cos(d2r(bull.angle)) * bulletSpeed;
			bull.y += Math.sin(d2r(bull.angle)) * bulletSpeed;
			
			bull.element.style.left = bull.x + "px";
			bull.element.style.top = bull.y + "px";
			
			if (bull.dist > bull.maxDist) {
				
				loading_spawn_hit(bull);
				
				bull.element.remove();
				bullets.splice(i, 1);
			}
		}
		
		for (var i = hits.length - 1; i >= 0; i--) {
			var hit = hits[i];
			hit.scale += 0.05;
			hit.element.style.transform = "scale(" + hit.scale + ")";
			if (hit.scale >= 1.5) {
				hit.element.remove();
				hits.splice(i, 1);
			}
		}
		
		charAngle = reach(charAngle, 0, 0.05);
		shooter.style.transform = "rotate(" + Math.floor(charAngle) + "deg)";
		
	}, 5);	


	document.addEventListener('mousedown', function(event) {
			if (loadingDone == false) {
			loading_spawn_bullet();
			}
	});	
	
	loading_fake_start();
}

function loading_spawn_hit(bull) {
	var hit = {}
	var clone = hitTemplate.cloneNode(true);
	
	clone.style.left = bull.x +"px";
	clone.style.top = bull.y + "px";
	hit.scale = 0.1;
	hit.element = clone;
	
	scene.appendChild(clone);
	
	hits.push(hit);
}

function loading_spawn_bullet() {
	if (document.hidden || loadingDone) {
		return false;
	}
	
	var bull = {};
	
	var clone = bullet.cloneNode(true);	
	var rect = shooter.getBoundingClientRect();
	
	bull.maxDist = bulletMaxDist + getRandomInt(0, 20);
	bull.element = clone;
	bull.x = rect.left  + (rect.right - rect.left) * 0.5 + Math.cos(d2r(charAngle));
	bull.y = rect.top + (rect.bottom - rect.top) * 0.5 - Math.sin(d2r(charAngle));
	
	bull.dist = 0;
	
	var rand = getRandomInt(0, 3) - getRandomInt(0, 3)
	
	bull.angle = Math.floor(charAngle) + rand;
	bull.element.style.transform = "rotate(" + bull.angle + "deg)";
	
	charAngle += rand * 3;
	
	shooter.style.transform = "rotate(" + charAngle + "deg)";
	
	scene.appendChild(bull.element);
	
	bullets.push(bull);
	
	return true;
}

function loading_bar_update(progress) {
	progress = Math.max(fakeCent, progress);
	fill.style.width = progress + "%";
	proc.innerHTML = Math.floor(progress) + "%"
}		


function loading_done() {
	clearInterval(bulletSpawn);
	clearInterval(bulletCheck);
	
	loadingDone = true;	
	
	for (var i = bullets.length - 1; i >= 0; i--) {
		var bull = bullets[i];
		bull.element.remove();
	}
	
	for (var i = hits.length - 1; i >= 0; i--) {
		var hit = hits[i];
		hit.element.remove();
	}
		
	bullets = [];
	hits = [];
	
	scene.remove();	
}


function loading_update(progress) {
	fakeCentTarget = Math.max(fakeCent, fakeCentTarget, (progress * 0.8) * 100);
	sdk.gameLoadingProgress({percentageDone: progress * 0.9});

	if (progress == 1) {
		fakeCentTarget = 100;
		fakeCent = 100;
		loading_bar_update(100);					
		
		loading_done();
		
		setTimeout(function () {
			document.getElementById("canvas").style.display = "block";
			clearInterval(fakeLoading);					
		}, 300);
	}
	bodyLoad = true;	
}

function loading_fake_start() {
	fakeLoading = setInterval(function() {
		if (bodyLoad == false) {
			if (fakeCentTarget < 10) {
				fakeCentTarget += 0.04;
			} else if (fakeCentTarget < 50) {
				fakeCentTarget += 0.02;
			} else if (fakeCentTarget < 70) {
				fakeCentTarget += 0.01;	
			}
		} 
		
		if (fakeCentTarget - fakeCent > 1) {
			fakeCent = loading_lerp(fakeCent, fakeCentTarget, lerpSpd);
		} else if (bodyLoad) {
			if (fakeCentTarget < 70) {
				fakeCentTarget += 0.2;
			} else if (fakeCentTarget <= 99) {
				fakeCentTarget += 0.02;
			}
		}
		loading_bar_update(fakeCent);
	}, 10);	
}


function loading_spinny_start(spinnyId) {
	var angle = 45;
	var spinny = document.getElementById(spinnyId);
	setInterval(function() {
		angle+=1;
		spinny.style.transform = "rotate(" + angle + "deg)";
	}, 5);		
}	

function loading_lerp (start, end, amt){
	return (1 - amt) * start + amt * end;
}


function d2r(d){
    var r=d*(Math.PI/180);
    return r;   
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function reach(current, target, step) {
    if (current < target) {
        current += step;
        return current > target ? target : current;
    } else {
        current -= step;
        return current < target ? target : current;
    }
}