/*
 * @LastEditTime: 2023-06-13 01:36:38
 * @Description: 背景落叶
 */

type UnIformListType = 'uProjection' | 'uModelview' | 'uResolution' | 'uOffset' | 'uDOF' | 'uFade' | 'uSrc' | 'uDelta' | 'uTimes' | 'uBlurDir' | 'uBloom';
type UnIforms = {
  [key in UnIformListType]?: any;
};

type AttrListType = 'aPosition' | 'aEuler' | 'aMisc';
type AttrIbutes = {
  [key in AttrListType]?: GLint;
};

interface MyShader extends WebGLProgram {
  uniforms?: UnIforms;
  attributes?: AttrIbutes;
}

interface ParticlesItem {
  velocity: number[];
  rotation: number[];
  position: number[];
  euler: number[];
  size: number;
  alpha: number;
  zKey: number;
  setVelocity: (vx: number, vy: number, vz: number) => void;
  setRotation: (rx: number, ry: number, rz: number) => void;
  setPosition: (nx: number, ny: number, nz: number) => void;
  setEulerAngles: (rx: number, ry: number, rz: number) => void;
  setSize: (s: number) => void;
  update: (dt: number) => void;
}

type PointFlowerType = {
  program?: MyShader | null;
  offset?: number[] | Float32Array;
  fader: { x: number; y: number; z: number; array?: number[] | Float32Array | undefined };
  numFlowers: number;
  particles: ParticlesItem[];
  dataArray: Float32Array | never[];
  positionArrayOffset: number;
  eulerArrayOffset: number;
  miscArrayOffset: number;
  buffer?: WebGLBuffer | null;
  area: { x: number; y: number; z: number };
};

interface EffectProgram {
  width: number;
  height: number;
  program: MyShader | null;
  dtxArray?: number[] | Float32Array;
  dataArray: Float32Array;
  buffer: WebGLBuffer | null;
  texture?: WebGLTexture | null;
  sizeArray: Float32Array;
  frameBuffer: WebGLFramebuffer | null;
  renderBuffer: WebGLRenderbuffer | null;
}

interface EffectLib {
  sceneBg?: EffectProgram;
  mkBrightBuf?: EffectProgram;
  dirBlur?: EffectProgram;
  finalComp?: EffectProgram;
}

type RtNameType = 'mainRT' | 'wFullRT0' | 'wFullRT1' | 'wHalfRT0' | 'wHalfRT1';

interface ProjectionType {
  angle: number;
  near_far: Float32Array;
  matrix: Float32Array;
}

// 启动
const fallenLeavesAnimation = (window: browserWindow & typeof globalThis, document: Document) => {
  window.requestAnimationFrame = (() => {
    const customRequestAnimationFrame = (callback: () => void) => {
      setTimeout(callback, 1000 / 60);
    };
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      customRequestAnimationFrame
    );
  })();
  const sankara_point_vsh = `
    uniform mat4 uProjection;
    uniform mat4 uModelview;
    uniform vec3 uResolution;
    uniform vec3 uOffset;
    uniform vec3 uDOF;  //x:focus distance, y:focus radius, z:max radius
    uniform vec3 uFade; //x:start distance, y:half distance, z:near fade start

    attribute vec3 aPosition;
    attribute vec3 aEuler;
    attribute vec2 aMisc; //x:size, y:fade

    varying vec3 pposition;
    varying float psize;
    varying float palpha;
    varying float pdist;

    //varying mat3 rotMat;
    varying vec3 normX;
    varying vec3 normY;
    varying vec3 normZ;
    varying vec3 normal;

    varying float diffuse;
    varying float specular;
    varying float rstop;
    varying float distancefade;

    void main(void) {
        // Projection is based on vertical angle
        vec4 pos = uModelview * vec4(aPosition + uOffset, 1.0);
        gl_Position = uProjection * pos;
        gl_PointSize = aMisc.x * uProjection[1][1] / -pos.z * uResolution.y * 0.5;

        pposition = pos.xyz;
        psize = aMisc.x;
        pdist = length(pos.xyz);
        palpha = smoothstep(0.0, 1.0, (pdist - 0.1) / uFade.z);

        vec3 elrsn = sin(aEuler);
        vec3 elrcs = cos(aEuler);
        mat3 rotx = mat3(
            1.0, 0.0, 0.0,
            0.0, elrcs.x, elrsn.x,
            0.0, -elrsn.x, elrcs.x
        );
        mat3 roty = mat3(
            elrcs.y, 0.0, -elrsn.y,
            0.0, 1.0, 0.0,
            elrsn.y, 0.0, elrcs.y
        );
        mat3 rotz = mat3(
            elrcs.z, elrsn.z, 0.0,
            -elrsn.z, elrcs.z, 0.0,
            0.0, 0.0, 1.0
        );
        mat3 rotmat = rotx * roty * rotz;
        normal = rotmat[2];

        mat3 trrotm = mat3(
            rotmat[0][0], rotmat[1][0], rotmat[2][0],
            rotmat[0][1], rotmat[1][1], rotmat[2][1],
            rotmat[0][2], rotmat[1][2], rotmat[2][2]
        );
        normX = trrotm[0];
        normY = trrotm[1];
        normZ = trrotm[2];

        const vec3 lit = vec3(0.6917144638660746, 0.6917144638660746, -0.20751433915982237);

        float tmpdfs = dot(lit, normal);
        if(tmpdfs < 0.0) {
            normal = -normal;
            tmpdfs = dot(lit, normal);
        }
        diffuse = 0.4 + tmpdfs;

        vec3 eyev = normalize(-pos.xyz);
        if(dot(eyev, normal) > 0.0) {
            vec3 hv = normalize(eyev + lit);
            specular = pow(max(dot(hv, normal), 0.0), 20.0);
        }
        else {
            specular = 0.0;
        }

        rstop = clamp((abs(pdist - uDOF.x) - uDOF.y) / uDOF.z, 0.0, 1.0);
        rstop = pow(rstop, 0.5);
        //-0.69315 = ln(0.5)
        distancefade = min(1.0, exp((uFade.x - pdist) * 0.69315 / uFade.y));
    }`;
  const sankara_point_fsh = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif

    uniform vec3 uDOF;  //x:focus distance, y:focus radius, z:max radius
    uniform vec3 uFade; //x:start distance, y:half distance, z:near fade start

    const vec3 fadeCol = vec3(0.08, 0.03, 0.06);

    varying vec3 pposition;
    varying float psize;
    varying float palpha;
    varying float pdist;

    //varying mat3 rotMat;
    varying vec3 normX;
    varying vec3 normY;
    varying vec3 normZ;
    varying vec3 normal;

    varying float diffuse;
    varying float specular;
    varying float rstop;
    varying float distancefade;

    float ellipse(vec2 p, vec2 o, vec2 r) {
        vec2 lp = (p - o) / r;
        return length(lp) - 1.0;
    }

    void main(void) {
        vec3 p = vec3(gl_PointCoord - vec2(0.5, 0.5), 0.0) * 2.0;
        vec3 d = vec3(0.0, 0.0, -1.0);
        float nd = normZ.z; //dot(-normZ, d);
        if(abs(nd) < 0.0001) discard;

        float np = dot(normZ, p);
        vec3 tp = p + d * np / nd;
        vec2 coord = vec2(dot(normX, tp), dot(normY, tp));

        //angle = 15 degree
        const float flwrsn = 0.258819045102521;
        const float flwrcs = 0.965925826289068;
        mat2 flwrm = mat2(flwrcs, -flwrsn, flwrsn, flwrcs);
        vec2 flwrp = vec2(abs(coord.x), coord.y) * flwrm;

        float r;
        if(flwrp.x < 0.0) {
            r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.36, 0.96) * 0.5);
        }
        else {
            r = ellipse(flwrp, vec2(0.065, 0.024) * 0.5, vec2(0.58, 0.96) * 0.5);
        }

        if(r > rstop) discard;

        vec3 col = mix(vec3(1.0, 0.8, 0.75), vec3(1.0, 0.9, 0.87), r);
        float grady = mix(0.0, 1.0, pow(coord.y * 0.5 + 0.5, 0.35));
        col *= vec3(1.0, grady, grady);
        col *= mix(0.8, 1.0, pow(abs(coord.x), 0.3));
        col = col * diffuse + specular;

        col = mix(fadeCol, col, distancefade);

        float alpha = (rstop > 0.001)? (0.5 - r / (rstop * 2.0)) : 1.0;
        alpha = smoothstep(0.0, 1.0, alpha) * palpha;

        gl_FragColor = vec4(col * 0.5, alpha);
    }`;
  const fx_common_vsh = `
    uniform vec3 uResolution;
    attribute vec2 aPosition;

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        texCoord = aPosition.xy * 0.5 + vec2(0.5, 0.5);
        screenCoord = aPosition.xy * vec2(uResolution.z, 1.0);
    }`;
  const bg_fsh = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif

    uniform vec2 uTimes;

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        vec3 col;
        float c;
        vec2 tm_pv = texCoord * vec2(0.8, 1.0) - vec2(0.95, 1.0);
        c = exp(-pow(length(tm_pv) * 1.8, 2.0));
        col = mix(vec3(0.02, 0.0, 0.03), vec3(0.96, 0.98, 1.0) * 1.5, c);
        gl_FragColor = vec4(col * 0.5, 1.0);
    }`;
  const fx_bright_buf_fsh = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif
    uniform sampler2D uSrc;
    uniform vec2 uDelta;

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        vec4 col = texture2D(uSrc, texCoord);
        gl_FragColor = vec4(col.rgb * 2.0 - vec3(0.5), 1.0);
    }`;
  const fx_dir_blur_r4_fsh = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif
    uniform sampler2D uSrc;
    uniform vec2 uDelta;
    uniform vec4 uBlurDir; //dir(x, y), stride(z, w)

    varying vec2 texCoord;
    varying vec2 screenCoord;

    void main(void) {
        vec4 col = texture2D(uSrc, texCoord);
        col = col + texture2D(uSrc, texCoord + uBlurDir.xy * uDelta);
        col = col + texture2D(uSrc, texCoord - uBlurDir.xy * uDelta);
        col = col + texture2D(uSrc, texCoord + (uBlurDir.xy + uBlurDir.zw) * uDelta);
        col = col + texture2D(uSrc, texCoord - (uBlurDir.xy + uBlurDir.zw) * uDelta);
        gl_FragColor = col / 5.0;
    }`;
  const pp_final_vsh = `
    uniform vec3 uResolution;
    attribute vec2 aPosition;
    varying vec2 texCoord;
    varying vec2 screenCoord;
    void main(void) {
        gl_Position = vec4(aPosition, 0.0, 1.0);
        texCoord = aPosition.xy * 0.5 + vec2(0.5, 0.5);
        screenCoord = aPosition.xy * vec2(uResolution.z, 1.0);
    }`;
  const pp_final_fsh = `
    #ifdef GL_ES
    //precision mediump float;
    precision highp float;
    #endif
    uniform sampler2D uSrc;
    uniform sampler2D uBloom;
    uniform vec2 uDelta;
    varying vec2 texCoord;
    varying vec2 screenCoord;
    void main(void) {
        vec4 srccol = texture2D(uSrc, texCoord) * 2.0;
        vec4 bloomcol = texture2D(uBloom, texCoord);
        vec4 col;
        col = srccol + bloomcol * (vec4(1.0) + srccol);
        col *= smoothstep(1.0, 0.0, pow(length((texCoord - vec2(0.5)) * 2.0), 1.2) * 0.5);
        col = pow(col, vec4(0.45454545454545)); //(1.0 / 2.2)

        gl_FragColor = vec4(col.rgb, 1.0);
        gl_FragColor.a = 1.0;
    }`;

  // Utilities
  const Vector3 = {
    create: (x: number, y: number, z: number) => {
      return { x: x, y: y, z: z };
    },
    dot: (v0: { x: number; y: number; z: number }, v1: { x: number; y: number; z: number }) => {
      return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
    },
    cross: (v: { x: number; y: number; z: number }, v0: { y: number; z: number; x: number }, v1: { z: number; y: number; x: number }) => {
      v.x = v0.y * v1.z - v0.z * v1.y;
      v.y = v0.z * v1.x - v0.x * v1.z;
      v.z = v0.x * v1.y - v0.y * v1.x;
    },
    normalize: (v: { x: number; y: number; z: number }) => {
      let l = v.x * v.x + v.y * v.y + v.z * v.z;
      if (l > 0.00001) {
        l = 1.0 / Math.sqrt(l);
        v.x *= l;
        v.y *= l;
        v.z *= l;
      }
    },
    arrayForm: (v: { array?: number[] | Float32Array; x: number; y: number; z: number }) => {
      if (v.array) {
        v.array[0] = v.x;
        v.array[1] = v.y;
        v.array[2] = v.z;
      } else {
        v.array = new Float32Array([v.x, v.y, v.z]);
      }
      return v.array;
    },
  };
  const Matrix44 = {
    createIdentity: () => {
      return new Float32Array([1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]);
    },
    loadProjection: (m: Float32Array, aspect: number, v_deg: number, near: number, far: number) => {
      const h = near * Math.tan(((v_deg * Math.PI) / 180.0) * 0.5) * 2.0;
      const w = h * aspect;

      m[0] = (2.0 * near) / w;
      m[1] = 0.0;
      m[2] = 0.0;
      m[3] = 0.0;

      m[4] = 0.0;
      m[5] = (2.0 * near) / h;
      m[6] = 0.0;
      m[7] = 0.0;

      m[8] = 0.0;
      m[9] = 0.0;
      m[10] = -(far + near) / (far - near);
      m[11] = -1.0;

      m[12] = 0.0;
      m[13] = 0.0;
      m[14] = (-2.0 * far * near) / (far - near);
      m[15] = 0.0;
    },
    loadLook_At: (
      m: Float32Array,
      v_pos: { x: number; y: number; z: number },
      v_look: { x: number; y: number; z: number },
      vup: { y: number; z: number; x: number }
    ) => {
      const front_v = Vector3.create(v_pos.x - v_look.x, v_pos.y - v_look.y, v_pos.z - v_look.z);
      Vector3.normalize(front_v);
      const side_v = Vector3.create(1.0, 0.0, 0.0);
      Vector3.cross(side_v, vup, front_v);
      Vector3.normalize(side_v);
      const top_v = Vector3.create(1.0, 0.0, 0.0);
      Vector3.cross(top_v, front_v, side_v);
      Vector3.normalize(top_v);

      m[0] = side_v.x;
      m[1] = top_v.x;
      m[2] = front_v.x;
      m[3] = 0.0;

      m[4] = side_v.y;
      m[5] = top_v.y;
      m[6] = front_v.y;
      m[7] = 0.0;

      m[8] = side_v.z;
      m[9] = top_v.z;
      m[10] = front_v.z;
      m[11] = 0.0;

      m[12] = -(v_pos.x * m[0] + v_pos.y * m[4] + v_pos.z * m[8]);
      m[13] = -(v_pos.x * m[1] + v_pos.y * m[5] + v_pos.z * m[9]);
      m[14] = -(v_pos.x * m[2] + v_pos.y * m[6] + v_pos.z * m[10]);
      m[15] = 1.0;
    },
  };

  //
  const timeInfo = {
    start: 0,
    prev: 0, // Date
    delta: 0,
    elapsed: 0, // Number(sec)
  };

  //
  let gl: WebGLRenderingContext;
  const renderSpec = {
    width: 0,
    height: 0,
    aspect: 1,
    array: new Float32Array(3),
    halfWidth: 0,
    halfHeight: 0,
    halfArray: new Float32Array(3),
    pointSize: { min: 0, max: 0 },
    mainRT: {} as EffectProgram,
    wFullRT0: {} as EffectProgram,
    wFullRT1: {} as EffectProgram,
    wHalfRT0: {} as EffectProgram,
    wHalfRT1: {} as EffectProgram,
    setSize(w: number, h: number) {
      const spec_this = this;
      spec_this.width = w;
      spec_this.height = h;
      spec_this.aspect = spec_this.width / spec_this.height;
      spec_this.array[0] = spec_this.width;
      spec_this.array[1] = spec_this.height;
      spec_this.array[2] = spec_this.aspect;

      spec_this.halfWidth = Math.floor(w / 2);
      spec_this.halfHeight = Math.floor(h / 2);
      spec_this.halfArray[0] = spec_this.halfWidth;
      spec_this.halfArray[1] = spec_this.halfHeight;
      spec_this.halfArray[2] = spec_this.halfWidth / spec_this.halfHeight;
    },
  };

  const deleteRenderTarget = (rt: EffectProgram) => {
    gl.deleteFramebuffer(rt.frameBuffer);
    gl.deleteRenderbuffer(rt.renderBuffer);
    if (rt.texture) gl.deleteTexture(rt.texture);
  };

  const createRenderTarget = (w: number, h: number) => {
    const ret = {
      width: w,
      height: h,
      sizeArray: new Float32Array([w, h, w / h]),
      dtxArray: new Float32Array([1.0 / w, 1.0 / h]),
      frameBuffer: gl.createFramebuffer(),
      renderBuffer: gl.createRenderbuffer(),
      texture: gl.createTexture(),
    } as EffectProgram;

    if (ret.texture) {
      gl.bindTexture(gl.TEXTURE_2D, ret.texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

      gl.bindFramebuffer(gl.FRAMEBUFFER, ret.frameBuffer);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, ret.texture, 0);

      gl.bindRenderbuffer(gl.RENDERBUFFER, ret.renderBuffer);
      gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, ret.renderBuffer);

      gl.bindTexture(gl.TEXTURE_2D, null);
      gl.bindRenderbuffer(gl.RENDERBUFFER, null);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    return ret;
  };

  const compileShader = (sh_type: GLenum, sh_src: string) => {
    const ret_sh = gl.createShader(sh_type);
    if (ret_sh) {
      gl.shaderSource(ret_sh, sh_src);
      gl.compileShader(ret_sh);

      if (!gl.getShaderParameter(ret_sh, gl.COMPILE_STATUS)) {
        const err_log = gl.getShaderInfoLog(ret_sh);
        gl.deleteShader(ret_sh);
        console.error(err_log);
        return null;
      }
    }
    return ret_sh;
  };

  const createShader = (vtx_src: string, frg_src: string, uni_form_list: UnIformListType[], attr_list: AttrListType[]): MyShader | null => {
    const vsh = compileShader(gl.VERTEX_SHADER, vtx_src);
    const fsh = compileShader(gl.FRAGMENT_SHADER, frg_src);

    if (vsh == null || fsh == null) {
      return null;
    }

    const prog = gl.createProgram() as MyShader;
    if (prog) {
      gl.attachShader(prog, vsh);
      gl.attachShader(prog, fsh);

      gl.deleteShader(vsh);
      gl.deleteShader(fsh);

      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        const err_log = gl.getProgramInfoLog(prog);
        console.error(err_log);
        return null;
      }

      if (uni_form_list) {
        prog.uniforms = {};
        for (let i = 0; i < uni_form_list.length; i++) {
          prog.uniforms[uni_form_list[i]] = gl.getUniformLocation(prog, uni_form_list[i]);
        }
      }

      if (attr_list) {
        prog.attributes = {};
        for (let i = 0; i < attr_list.length; i++) {
          const attr = attr_list[i];
          prog.attributes[attr] = gl.getAttribLocation(prog, attr);
        }
      }
    }

    return prog;
  };

  const homeShader = (prog: MyShader) => {
    gl.useProgram(prog);
    if (prog.attributes) {
      Object.values(prog.attributes).forEach((attr) => {
        gl.enableVertexAttribArray(attr);
      });
    }
  };

  const unHomeShader = (prog: MyShader) => {
    if (prog.attributes) {
      Object.values(prog.attributes).forEach((attr) => {
        gl.disableVertexAttribArray(attr);
      });
    }
    gl.useProgram(null);
  };

  /////
  const projection = {
    angle: 60,
    near_far: new Float32Array([0.1, 100.0]),
    matrix: Matrix44.createIdentity(),
  } as ProjectionType;
  const camera = {
    position: Vector3.create(0, 0, 100),
    look_at: Vector3.create(0, 0, 0),
    up: Vector3.create(0, 1, 0),
    dof: Vector3.create(10.0, 4.0, 8.0),
    matrix: Matrix44.createIdentity(),
  };

  const pointFlower: PointFlowerType = {
    numFlowers: 0,
    fader: { x: 0, y: 0, z: 0 },
    particles: [],
    area: { x: 0, y: 0, z: 0 },
    dataArray: [],
    positionArrayOffset: 0,
    eulerArrayOffset: 0,
    miscArrayOffset: 0,
  };
  // var meshFlower = {};
  let sceneStandBy = false;

  const blossomParticle = (): ParticlesItem => {
    const velocity = new Array(3);
    const rotation = new Array(3);
    const position = new Array(3);
    const euler = new Array(3);
    let size = 1.0;
    const alpha = 1.0;
    const zKey = 0.0;

    const setVelocity = (vx: number, vy: number, vz: number) => {
      velocity[0] = vx;
      velocity[1] = vy;
      velocity[2] = vz;
    };
    const setRotation = (rx: number, ry: number, rz: number) => {
      rotation[0] = rx;
      rotation[1] = ry;
      rotation[2] = rz;
    };

    const setPosition = (nx: number, ny: number, nz: number) => {
      position[0] = nx;
      position[1] = ny;
      position[2] = nz;
    };

    const setEulerAngles = (rx: number, ry: number, rz: number) => {
      euler[0] = rx;
      euler[1] = ry;
      euler[2] = rz;
    };

    const setSize = (s: number) => {
      size = s;
    };

    const update = (dt: number) => {
      position[0] += velocity[0] * dt;
      position[1] += velocity[1] * dt;
      position[2] += velocity[2] * dt;

      euler[0] += rotation[0] * dt;
      euler[1] += rotation[1] * dt;
      euler[2] += rotation[2] * dt;
    };
    return {
      velocity,
      rotation,
      position,
      euler,
      size,
      alpha,
      zKey,
      setVelocity,
      setRotation,
      setPosition,
      setEulerAngles,
      setSize,
      update,
    };
  };

  function createPointFlowers() {
    // get point sizes
    const prm = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);
    renderSpec.pointSize = { min: prm[0], max: prm[1] };

    const vtx_src = sankara_point_vsh;
    const frg_src = sankara_point_fsh;

    pointFlower.program = createShader(
      vtx_src,
      frg_src,
      ['uProjection', 'uModelview', 'uResolution', 'uOffset', 'uDOF', 'uFade'],
      ['aPosition', 'aEuler', 'aMisc']
    );

    if (pointFlower.program) homeShader(pointFlower.program);
    pointFlower.offset = new Float32Array([0.0, 0.0, 0.0]);
    pointFlower.fader = Vector3.create(0.0, 10.0, 0.0);

    // paramerters: velocity[3], rotate[3]
    pointFlower.numFlowers = 1600;
    pointFlower.particles = new Array(pointFlower.numFlowers);
    // vertex attributes {position[3], euler_xyz[3], size[1]}
    pointFlower.dataArray = new Float32Array(pointFlower.numFlowers * (3 + 3 + 2));
    pointFlower.positionArrayOffset = 0;
    pointFlower.eulerArrayOffset = pointFlower.numFlowers * 3;
    pointFlower.miscArrayOffset = pointFlower.numFlowers * 6;

    pointFlower.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray, gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    if (pointFlower.program) unHomeShader(pointFlower.program);

    for (let i = 0; i < pointFlower.numFlowers; i++) {
      pointFlower.particles[i] = blossomParticle();
    }
  }

  const initPointFlowers = () => {
    //area
    pointFlower.area = Vector3.create(20.0, 20.0, 20.0);
    pointFlower.area.x = pointFlower.area.y * renderSpec.aspect;

    pointFlower.fader.x = 10.0; //env fade start
    pointFlower.fader.y = pointFlower.area.z; //env fade half
    pointFlower.fader.z = 0.1; //near fade start

    //particles
    const PI2 = Math.PI * 2.0;
    const tm_pv3 = Vector3.create(0, 0, 0);
    let tm_pv = 0;
    const symmetryRand = () => {
      return Math.random() * 2.0 - 1.0;
    };
    for (let i = 0; i < pointFlower.numFlowers; i++) {
      const tmpPrTcl = pointFlower.particles[i];

      //velocity
      tm_pv3.x = symmetryRand() * 0.3 + 0.8;
      tm_pv3.y = symmetryRand() * 0.2 - 1.0;
      tm_pv3.z = symmetryRand() * 0.3 + 0.5;
      Vector3.normalize(tm_pv3);
      tm_pv = 2.0 + Math.random() * 1.0;
      tmpPrTcl.setVelocity(tm_pv3.x * tm_pv, tm_pv3.y * tm_pv, tm_pv3.z * tm_pv);

      //rotation
      tmpPrTcl.setRotation(symmetryRand() * PI2 * 0.5, symmetryRand() * PI2 * 0.5, symmetryRand() * PI2 * 0.5);

      //position
      tmpPrTcl.setPosition(symmetryRand() * pointFlower.area.x, symmetryRand() * pointFlower.area.y, symmetryRand() * pointFlower.area.z);

      //euler
      tmpPrTcl.setEulerAngles(Math.random() * Math.PI * 2.0, Math.random() * Math.PI * 2.0, Math.random() * Math.PI * 2.0);

      //size
      tmpPrTcl.setSize(0.9 + Math.random() * 0.1);
    }
  };

  const renderPointFlowers = () => {
    //update
    const PI2 = Math.PI * 2.0;
    // var limit = [pointFlower.area.x, pointFlower.area.y, pointFlower.area.z];
    const repeatPos = (prt: ParticlesItem, cmp: number, limit: number) => {
      if (Math.abs(prt.position[cmp]) - prt.size * 0.5 > limit) {
        //out of area
        if (prt.position[cmp] > 0) {
          prt.position[cmp] -= limit * 2.0;
        } else {
          prt.position[cmp] += limit * 2.0;
        }
      }
    };
    const repeatEuler = (prt: ParticlesItem, cmp: number) => {
      prt.euler[cmp] = prt.euler[cmp] % PI2;
      if (prt.euler[cmp] < 0.0) {
        prt.euler[cmp] += PI2;
      }
    };

    for (let i = 0; i < pointFlower.numFlowers; i++) {
      const prTcl = pointFlower.particles[i];
      prTcl.update(timeInfo.delta);
      repeatPos(prTcl, 0, pointFlower.area.x);
      repeatPos(prTcl, 1, pointFlower.area.y);
      repeatPos(prTcl, 2, pointFlower.area.z);
      repeatEuler(prTcl, 0);
      repeatEuler(prTcl, 1);
      repeatEuler(prTcl, 2);

      prTcl.alpha = 1.0; //(pointFlower.area.z - prTcl.position[2]) * 0.5;

      prTcl.zKey = camera.matrix[2] * prTcl.position[0] + camera.matrix[6] * prTcl.position[1] + camera.matrix[10] * prTcl.position[2] + camera.matrix[14];
    }

    // sort
    pointFlower.particles.sort(function (p0, p1) {
      return p0.zKey - p1.zKey;
    });

    // update data
    let ip_os = pointFlower.positionArrayOffset;
    let ieu_ler = pointFlower.eulerArrayOffset;
    let im_isc = pointFlower.miscArrayOffset;
    for (let i = 0; i < pointFlower.numFlowers; i++) {
      const prTcl = pointFlower.particles[i];
      pointFlower.dataArray[ip_os] = prTcl.position[0];
      pointFlower.dataArray[ip_os + 1] = prTcl.position[1];
      pointFlower.dataArray[ip_os + 2] = prTcl.position[2];
      ip_os += 3;
      pointFlower.dataArray[ieu_ler] = prTcl.euler[0];
      pointFlower.dataArray[ieu_ler + 1] = prTcl.euler[1];
      pointFlower.dataArray[ieu_ler + 2] = prTcl.euler[2];
      ieu_ler += 3;
      pointFlower.dataArray[im_isc] = prTcl.size;
      pointFlower.dataArray[im_isc + 1] = prTcl.alpha;
      im_isc += 2;
    }

    //draw
    gl.enable(gl.BLEND);
    //gl.disable(gl.DEPTH_TEST);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const prog = pointFlower.program;
    if (prog) {
      homeShader(prog);

      if (prog.uniforms) {
        gl.uniformMatrix4fv(prog.uniforms.uProjection, false, projection.matrix);
        gl.uniformMatrix4fv(prog.uniforms.uModelview, false, camera.matrix);
        gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);
        gl.uniform3fv(prog.uniforms.uDOF, Vector3.arrayForm(camera.dof));
        gl.uniform3fv(prog.uniforms.uFade, Vector3.arrayForm(pointFlower.fader));
      }

      if (pointFlower.buffer) gl.bindBuffer(gl.ARRAY_BUFFER, pointFlower.buffer);
      if (pointFlower.dataArray.length > 0) gl.bufferData(gl.ARRAY_BUFFER, pointFlower.dataArray[0], gl.DYNAMIC_DRAW);

      if (prog.attributes) {
        if (prog.attributes.aPosition)
          gl.vertexAttribPointer(prog.attributes.aPosition, 3, gl.FLOAT, false, 0, pointFlower.positionArrayOffset * Float32Array.BYTES_PER_ELEMENT);
        if (prog.attributes.aEuler)
          gl.vertexAttribPointer(prog.attributes.aEuler, 3, gl.FLOAT, false, 0, pointFlower.eulerArrayOffset * Float32Array.BYTES_PER_ELEMENT);
        if (prog.attributes.aMisc)
          gl.vertexAttribPointer(prog.attributes.aMisc, 2, gl.FLOAT, false, 0, pointFlower.miscArrayOffset * Float32Array.BYTES_PER_ELEMENT);
      }
    }

    // doubler
    if (pointFlower.offset && prog && prog.uniforms) {
      for (let i = 1; i < 2; i++) {
        const zp_os = i * -2.0;
        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zp_os;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * -1.0;
        pointFlower.offset[1] = pointFlower.area.y * 1.0;
        pointFlower.offset[2] = pointFlower.area.z * zp_os;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * 1.0;
        pointFlower.offset[1] = pointFlower.area.y * -1.0;
        pointFlower.offset[2] = pointFlower.area.z * zp_os;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

        pointFlower.offset[0] = pointFlower.area.x * 1.0;
        pointFlower.offset[1] = pointFlower.area.y * 1.0;
        pointFlower.offset[2] = pointFlower.area.z * zp_os;
        gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
        gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);
      }

      //main
      pointFlower.offset[0] = 0.0;
      pointFlower.offset[1] = 0.0;
      pointFlower.offset[2] = 0.0;
      if (prog.uniforms) gl.uniform3fv(prog.uniforms.uOffset, pointFlower.offset);
      gl.drawArrays(gl.POINTS, 0, pointFlower.numFlowers);

      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      unHomeShader(prog);

      gl.enable(gl.DEPTH_TEST);
      gl.disable(gl.BLEND);
    }
  };

  // effects
  //common util
  const createEffectProgram = (vtx_src: string, frg_src: string, ex_uni_fs: UnIformListType[] | null, ex_attrs: AttrListType[] | null) => {
    let uni_fs: UnIformListType[] = ['uResolution', 'uSrc', 'uDelta'];
    if (ex_uni_fs) {
      uni_fs = uni_fs.concat(ex_uni_fs);
    }
    let attrs: AttrListType[] = ['aPosition'];
    if (ex_attrs) {
      attrs = attrs.concat(ex_attrs);
    }
    const ret = {
      width: 0,
      height: 0,
      program: createShader(vtx_src, frg_src, uni_fs, attrs),
      dataArray: new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]),
      buffer: gl.createBuffer(),
    } as EffectProgram;

    ret.program && homeShader(ret.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, ret.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, ret.dataArray, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    ret.program && unHomeShader(ret.program);

    return ret;
  };

  // basic usage
  // homeEffect(prog, src_tex({'texture':texid, 'dtxArray':(f32)[dtx, dty]})); //basic initialize
  // gl.uniform**(...); //additional uniforms
  // drawEffect()
  // unHomeEffect(prog)
  // TEXTURE0 makes src
  const homeEffect = (fx_obj: EffectProgram, src_tex: EffectProgram | null) => {
    const prog = fx_obj.program;
    if (!prog || !prog.uniforms) return;
    homeShader(prog);
    gl.uniform3fv(prog.uniforms.uResolution, renderSpec.array);

    if (src_tex != null && src_tex.dtxArray && src_tex.texture) {
      gl.uniform2fv(prog.uniforms.uDelta, src_tex.dtxArray);
      gl.uniform1i(prog.uniforms.uSrc, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, src_tex.texture);
    }
  };
  const drawEffect = (fx_obj: EffectProgram) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, fx_obj.buffer);
    if (fx_obj.program?.attributes?.aPosition) gl.vertexAttribPointer(fx_obj.program.attributes.aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const unHomeEffect = (fx_obj: EffectProgram) => {
    if (fx_obj.program) unHomeShader(fx_obj.program);
  };

  const effectLib = {} as EffectLib;
  function createEffectLib() {
    let frg_src;
    //common
    const cm_nv_tx_src = fx_common_vsh;

    //background
    frg_src = bg_fsh;
    effectLib.sceneBg = createEffectProgram(cm_nv_tx_src, frg_src, ['uTimes'], null);

    // make brightpixels buffer
    frg_src = fx_bright_buf_fsh;
    effectLib.mkBrightBuf = createEffectProgram(cm_nv_tx_src, frg_src, null, null);

    // direction blur
    frg_src = fx_dir_blur_r4_fsh;
    effectLib.dirBlur = createEffectProgram(cm_nv_tx_src, frg_src, ['uBlurDir'], null);

    //final composite
    const vtx_src = pp_final_vsh;
    frg_src = pp_final_fsh;
    // console.log('frg_src :',frg_src )
    effectLib.finalComp = createEffectProgram(vtx_src, frg_src, ['uBloom'], null);
  }

  // background
  function createBackground() {
    //console.log("create background");
  }
  function initBackground() {
    //console.log("init background");
  }
  function renderBackground() {
    gl.disable(gl.DEPTH_TEST);
    if (effectLib.sceneBg?.program?.uniforms) {
      homeEffect(effectLib.sceneBg, null);
      gl.uniform2f(effectLib.sceneBg.program.uniforms.uTimes, timeInfo.elapsed, timeInfo.delta);
      drawEffect(effectLib.sceneBg);
      unHomeEffect(effectLib.sceneBg);
    }

    gl.enable(gl.DEPTH_TEST);
  }

  // post process
  // var postProcess = {};
  function createPostProcess() {
    //console.log("create post process");
  }
  function initPostProcess() {
    //console.log("init post process");
  }

  function renderPostProcess() {
    gl.enable(gl.TEXTURE_2D);
    gl.disable(gl.DEPTH_TEST);
    const bindRT = (rt: EffectProgram, is_clear: boolean) => {
      gl.bindFramebuffer(gl.FRAMEBUFFER, rt.frameBuffer);
      gl.viewport(0, 0, rt.width, rt.height);
      if (is_clear) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      }
    };

    //make bright buff
    bindRT(renderSpec.wHalfRT0, true);
    if (effectLib.mkBrightBuf && effectLib.dirBlur?.program?.uniforms && effectLib.finalComp?.program?.uniforms) {
      homeEffect(effectLib.mkBrightBuf, renderSpec.mainRT);
      drawEffect(effectLib.mkBrightBuf);
      unHomeEffect(effectLib.mkBrightBuf);

      // make bloom
      for (let i = 0; i < 2; i++) {
        const p = 1.5 + 1 * i;
        const s = 2.0 + 1 * i;
        bindRT(renderSpec.wHalfRT1, true);
        homeEffect(effectLib.dirBlur, renderSpec.wHalfRT0);
        gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, p, 0.0, s, 0.0);
        drawEffect(effectLib.dirBlur);
        unHomeEffect(effectLib.dirBlur);

        bindRT(renderSpec.wHalfRT0, true);
        homeEffect(effectLib.dirBlur, renderSpec.wHalfRT1);
        gl.uniform4f(effectLib.dirBlur.program.uniforms.uBlurDir, 0.0, p, 0.0, s);
        drawEffect(effectLib.dirBlur);
        unHomeEffect(effectLib.dirBlur);
      }

      //display
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, renderSpec.width, renderSpec.height);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      homeEffect(effectLib.finalComp, renderSpec.mainRT);
      gl.uniform1i(effectLib.finalComp.program.uniforms.uBloom, 1);
      gl.activeTexture(gl.TEXTURE1);
      if (renderSpec.wHalfRT0.texture) gl.bindTexture(gl.TEXTURE_2D, renderSpec.wHalfRT0.texture);
      drawEffect(effectLib.finalComp);
      unHomeEffect(effectLib.finalComp);
    }

    gl.enable(gl.DEPTH_TEST);
  }

  /////
  // var SceneEnv = {};
  function createScene() {
    createEffectLib();
    createBackground();
    createPointFlowers();
    createPostProcess();
    sceneStandBy = true;
  }

  function initScene() {
    initBackground();
    initPointFlowers();
    initPostProcess();

    //camera.position.z = 17.320508;
    camera.position.z = pointFlower.area.z + projection.near_far[0];
    projection.angle = ((Math.atan2(pointFlower.area.y, camera.position.z + pointFlower.area.z) * 180.0) / Math.PI) * 2.0;
    Matrix44.loadProjection(projection.matrix, renderSpec.aspect, projection.angle, projection.near_far[0], projection.near_far[1]);
  }

  function renderScene() {
    //draw
    Matrix44.loadLook_At(camera.matrix, camera.position, camera.look_at, camera.up);

    gl.enable(gl.DEPTH_TEST);

    //gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, renderSpec.mainRT.frameBuffer);
    gl.viewport(0, 0, renderSpec.mainRT.width, renderSpec.mainRT.height);
    gl.clearColor(0.005, 0, 0.05, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderBackground();
    renderPointFlowers();
    renderPostProcess();
  }

  /////
  const onResize = (canvas: HTMLCanvasElement) => {
    makeCanvasFullScreen(canvas);
    setViewPorts();
    if (sceneStandBy) {
      initScene();
    }
  };

  function setViewPorts() {
    renderSpec.setSize(gl.canvas.width, gl.canvas.height);

    gl.clearColor(0.2, 0.2, 0.5, 1.0);
    gl.viewport(0, 0, renderSpec.width, renderSpec.height);

    const rtFunc = (rt_name: RtNameType, rtw: number, rth: number) => {
      const rt = renderSpec[rt_name];
      if (rt) deleteRenderTarget(rt);
      renderSpec[rt_name] = createRenderTarget(rtw, rth);
    };
    rtFunc('mainRT', renderSpec.width, renderSpec.height);
    rtFunc('wFullRT0', renderSpec.width, renderSpec.height);
    rtFunc('wFullRT1', renderSpec.width, renderSpec.height);
    rtFunc('wHalfRT0', renderSpec.halfWidth, renderSpec.halfHeight);
    rtFunc('wHalfRT1', renderSpec.halfWidth, renderSpec.halfHeight);
  }

  function render() {
    renderScene();
  }

  const animating = true;
  // function toggleAnimation(elm) {
  //   animating ^= true;
  //   if (animating) animate();
  //   if (elm) {
  //     elm.innerHTML = animating ? 'Stop' : 'Start';
  //   }
  // }

  // function stepAnimation() {
  //   if (!animating) animate();
  // }

  function animate() {
    const curdate = new Date().getTime();
    timeInfo.elapsed = (curdate - timeInfo.start) / 1000.0;
    timeInfo.delta = (curdate - timeInfo.prev) / 1000.0;
    timeInfo.prev = curdate;

    if (animating) requestAnimationFrame(animate);
    render();
  }

  const makeCanvasFullScreen = (canvas: HTMLCanvasElement) => {
    const b = document.body;
    const d = document.documentElement;
    const fullw = Math.max(b.clientWidth, b.scrollWidth, d.scrollWidth, d.clientWidth);
    const fullh = Math.max(b.clientHeight, b.scrollHeight, d.scrollHeight, d.clientHeight);
    canvas.width = fullw;
    canvas.height = fullh;
  };

  // window.addEventListener('load', function(e) {
  //   var canvas = document.getElementById('sankara');
  //   try {
  //     makeCanvasFullScreen(canvas);
  //     gl = canvas.getContext('experimental-webgl');
  //   } catch (e) {
  //     alert('WebGL not supported.' + e);
  //     console.error(e);
  //     return;
  //   }

  // window.addEventListener('resize', onResize);

  //   setViewports();
  //   createScene();
  //   initScene();

  //   timeInfo.start = new Date();
  //   timeInfo.prev = timeInfo.start;
  //   animate();
  // });\
  const loadCanvas = () => {
    setViewPorts();
    createScene();
    initScene();

    timeInfo.start = new Date().getTime();
    timeInfo.prev = timeInfo.start;
    animate();
  };

  const init = () => {
    const canvas = document.createElement('canvas');
    try {
      if (canvas) {
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '5';
        // canvas.style.opacity = '0.5';
        makeCanvasFullScreen(canvas);
        const webgl = canvas.getContext('webgl');
        if (webgl) {
          console.log(154);

          gl = webgl as WebGLRenderingContext;
        }
      }
    } catch (e) {
      console.error(e);
      return;
    }
    document.body.appendChild(canvas);
    window.addEventListener('load', loadCanvas);

    window.addEventListener('resize', () => onResize(canvas));
  };
  init();
};

// 设置
export const setupFallenLeavesAnimation = () => {
  fallenLeavesAnimation(window, document);
};
