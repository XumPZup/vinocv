let canvas = document.getElementById('filtered-image');
let original = document.getElementById('original-image');
let label = 'Villa Sparina\nGavi di Gavi DOCG\n2023\n#000/500'.split('\n');

let colors = [[[233, 46, 251], [255, 32, 121], [68, 11, 212], [4, 0, 94]],
	     [[255, 227, 241], [254, 28, 128], [255, 95, 1], [206, 0, 0]],
	     [[59, 39, 186], [232, 71, 174], [18, 202, 145], [255, 148, 114]]]

let pal = colors[Math.floor(Math.random() * colors.length)];
console.log(pal);
let t = 150;
let inc = 1;

//let edges = new cv.Mat();
//let image_sum = new cv.Mat();

let src = cv.imread(original);


canvas.addEventListener('click', start_stop);

let random_min = -7;
let random_max = 7;


let interval = 0;
function start_stop(){
	if(interval == 0){
		interval = setInterval(make_countour, 150, src);
	}else{
		clearInterval(interval);
		interval = 0;
	}
}

make_countour(src);


function make_countour(src){
	let dst = cv.Mat.zeros(src.cols, src.rows, cv.CV_8UC3);
	let gray = new cv.Mat();
	cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
	cv.threshold(gray, gray, t%255, 255, cv.THRESH_BINARY);
	let contours = new cv.MatVector();
	let hierarchy = new cv.Mat();
	// You can try more different parameters
	cv.findContours(gray, contours, hierarchy, 3, 2);
	// draw contours with random Scalar
	for (let i = 0; i < contours.size(); ++i) {
		//let color = new cv.Scalar(Math.round(Math.random() * 255), Math.round(Math.random() * 255),
		//		      Math.round(Math.random() * 255));
		
		let color = new cv.Scalar(pal[i%pal.length][0], pal[i%pal.length][1], pal[i%pal.length][2]);
		cv.drawContours(dst, contours, i, color, 1, cv.LINE_4, hierarchy, 100);
	}
	t+=inc;
	if(t > 225 || t < 150){
		inc*=-1;
	}
	console.log(t);
	let first_sum = new cv.Mat();
	dst = dst.roi(new cv.Rect(1, 1, 997, 997))
	cv.add(displace(dst), displace(dst), first_sum);
	cv.add(first_sum, displace(dst), dst);
	let step = 25;
	for(var i=0; i<label.length; i++){
		cv.putText(dst, label[i], new cv.Point(700, 30 + step*i), cv.FONT_HERSHEY_SIMPLEX, .8, new cv.Scalar(pal[2][0], pal[2][1], pal[2][1]), cv.LINE_4);
	}

	cv.imshow('filtered-image', dst);
	dst.delete(); gray.delete();
	contours.delete(); hierarchy.delete();
	first_sum.delete();
}


function displace(src){
	let dst = new cv.Mat();
	let x = Math.floor(Math.random()*(random_max - random_min)- random_min);
	let y = Math.floor(Math.random()*(random_max - random_min)- random_min);
	let M = cv.matFromArray(2, 3, cv.CV_64FC1, [1, 0, x, 0, 1, y]);
	let dsize = new cv.Size(src.rows, src.cols);
	// You can try more different parameters
	cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
	M.delete();
	return dst
}




/*
cv.Canny(src, edges, 0, 255, 3, false);

cv.cvtColor(edges, edges, cv.COLOR_GRAY2BGR);
cv.cvtColor(src, src, cv.COLOR_GRAY2BGR);

cv.add(src, dst, image_sum);
//cv.add(image_sum, src, image_sum);
//make_countour(src);


let gray = new cv.Mat();
let edges = new cv.Mat();

let image_sum = new cv.Mat();

let mat = cv.imread(original);


// grayscale
cv.cvtColor(mat, gray, cv.COLOR_RGB2GRAY, 0);
// canny
cv.Canny(gray, edges, 0, 255, 3, false);
cv.add(gray, edges, image_sum);
*/



//cv.imshow('filtered-image', image_sum);
