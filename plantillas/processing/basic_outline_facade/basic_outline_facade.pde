//-----------------------------------
void setup() {
  size(1024, 768);//custom size
  //fullScreen();
}

//-----------------------------------
void draw() {
  background(100); //Gray Color Background
  stroke(255, 0, 0); //RGB Contour Color. https://processing.org/reference/stroke_.html
  drawFacadeContourInside(); //Facade Contour


  stroke(255); 
  pushMatrix(); //PushMatrix to simpl draw other things always from pixel (40, 40) as reference --> https://processing.org/reference/pushMatrix_.html
  translate(40, 40);
  int marginText = 10;
  text("JuegosReunidos", marginText, 32+125-marginText); 
  popMatrix();
}

//-----------------------------------
void drawFacadeContourInside()
{

  //left line
  line(40, 72, 40, 196);

  //bottom
  line(40, 196, 231, 196);

  //right side
  line(231, 72, 231, 196);

  // steps
  //flat left
  line(40, 72, 76, 72);

  //vert
  line(76, 72, 76, 56);

  // hor
  line(76, 56, 112, 56);

  //vert
  line(112, 56, 112, 40);

  //top
  line(112, 40, 159, 40);

  //vert right side
  line(159, 40, 159, 56);

  //hors
  line(160, 56, 195, 56);

  //  vert
  line(195, 56, 195, 72);

  //hor
  line(196, 72, 231, 72);
}


void keyReleased() {
  
  if(key == 's'){
    save("savedImage.tif");
  }
  
}