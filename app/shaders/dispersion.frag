precision mediump float;

struct IOR {
    float r;
    float g;
    float b;
    float c;
    float y;
    float v;
};
uniform IOR u_ior;
uniform vec2 u_resolution;
uniform float u_chromaticAberration;
uniform float u_refractionPower;
uniform float u_saturate;
uniform float u_shininess;
uniform float u_diffuseness;
uniform float u_fresnelPower;
uniform vec3 u_light;
uniform sampler2D u_texture;

varying vec3 v_worldNormal;
varying vec3 v_eyeVector;

const int LOOP=16;

vec3 sat(vec3 rgb,float intensity){
    return mix(vec3(dot(rgb,vec3(.2126,.7152,.0722))),rgb,intensity);
}

float fresnel(vec3 eye, vec3 normal, float power) {
  return pow(1.0 - abs(dot(eye, normal)), power);
}

float specular(vec3 light, float shininess, float diffuseness) {
  vec3 lightVector = normalize(-light);
  vec3 halfVector = normalize(v_eyeVector + lightVector);

  float NdotL = dot(v_worldNormal, lightVector);
  float NdotH =  dot(v_worldNormal, halfVector);
  float kDiffuse = max(0.0, NdotL);
  float NdotH2 = NdotH * NdotH;

  float kSpecular = pow(NdotH2, shininess);
  return  kSpecular + kDiffuse * diffuseness;
}

void main(){
    vec2 uv=gl_FragCoord.xy/u_resolution.xy;
    
    vec3 color=vec3(0.);
    
    for(int i=0;i<LOOP;i++){
        float slide=float(i)/float(LOOP)*.1;
        
        vec3 refractionR=refract(v_eyeVector,v_worldNormal,1./u_ior.r);
        vec3 refractionY=refract(v_eyeVector,v_worldNormal,1./u_ior.y);
        vec3 refractionG=refract(v_eyeVector,v_worldNormal,1./u_ior.g);
        vec3 refractionC=refract(v_eyeVector,v_worldNormal,1./u_ior.c);
        vec3 refractionB=refract(v_eyeVector,v_worldNormal,1./u_ior.b);
        vec3 refractionV=refract(v_eyeVector,v_worldNormal,1./u_ior.v);
        
        float r=texture2D(u_texture,uv+refractionR.xy*(u_refractionPower+slide*1.)*u_chromaticAberration).x*.5;
        
        float y=(texture2D(u_texture,uv+refractionY.xy*(u_refractionPower+slide*1.)*u_chromaticAberration).x*2.+
        texture2D(u_texture,uv+refractionY.xy*(u_refractionPower+slide*1.)*u_chromaticAberration).y*2.-
        texture2D(u_texture,uv+refractionY.xy*(u_refractionPower+slide*1.)*u_chromaticAberration).z)/6.;
        
        float g=texture2D(u_texture,uv+refractionG.xy*(u_refractionPower+slide*2.)*u_chromaticAberration).y*.5;
        
        float c=(texture2D(u_texture,uv+refractionC.xy*(u_refractionPower+slide*2.5)*u_chromaticAberration).y*2.+
        texture2D(u_texture,uv+refractionC.xy*(u_refractionPower+slide*2.5)*u_chromaticAberration).z*2.-
        texture2D(u_texture,uv+refractionC.xy*(u_refractionPower+slide*2.5)*u_chromaticAberration).x)/6.;
        
        float b=texture2D(u_texture,uv+refractionB.xy*(u_refractionPower+slide*3.)*u_chromaticAberration).z*.5;
        
        float v=(texture2D(u_texture,uv+refractionV.xy*(u_refractionPower+slide*1.)*u_chromaticAberration).z*2.+
        texture2D(u_texture,uv+refractionV.xy*(u_refractionPower+slide*1.)*u_chromaticAberration).x*2.-
        texture2D(u_texture,uv+refractionV.xy*(u_refractionPower+slide*1.)*u_chromaticAberration).y)/6.;
        
        float R=r+(2.*v+2.*y-c)/3.;
        float G=g+(2.*y+2.*c-v)/3.;
        float B=b+(2.*c+2.*v-y)/3.;
        
        color.r+=R;
        color.g+=G;
        color.b+=B;
        
        color=sat(color,u_saturate);
    }
    
    color/=float(LOOP);

    // Specular Lighting
    float specularLight=specular(u_light,u_shininess,u_diffuseness);
    color+=specularLight;

    // Fresnel
    color += fresnel(v_eyeVector, v_worldNormal, u_fresnelPower) * vec3(1.0);

    gl_FragColor=vec4(color,1.);
}