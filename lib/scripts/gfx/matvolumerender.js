/*
Licensed to the Apache Software Foundation (ASF) under one
or more contributor license agreements.  See the NOTICE file
distributed with this work for additional information
regarding copyright ownership.  The ASF licenses this file
to you under the Apache License, Version 2.0 (the
"License"); you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

/**
* Final isosurface rendering material for CT dataset
* @module app/scripts/fgx/shaders/matskullvolume
*/

// ******************************************************************
// imports
// ******************************************************************

// absoulte imports
import THREE from 'n3d-threejs';

const VOL_RENDER_VERTEX_SHADER = './shaders/volumerender.vert';
const VOL_RENDER_FRAGMENT_SHADER = './shaders/volumerender.frag';

/** Class @class MaterialVolumeRender for create skull volume render shader material */
export default class MaterialVolumeRender {

  /** Simple material constructor
  * @constructor
  */
  constructor() {
    this.m_strShaderVertex = '';
    this.m_strShaderFragment = '';
    this.m_uniforms = {
      isoSurfTexel: { type: 'v2', value: null },
      lightDir: { type: 'v3', value: THREE.Vector3(0.0, 0.0, 0.0) },
      texVolume: { type: 't', value: null },
      texBF: { type: 't', value: null },
      texFF: { type: 't', value: null },
      texIsoSurface: { type: 't', value: null },
      colorMap1D: { type: 't', value: null },
      heatMap1D: { type: 't', value: null },
      t_function1min: { type: 'v4', value: THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
      t_function1max: { type: 'v4', value: THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
      t_function2min: { type: 'v4', value: THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
      t_function2max: { type: 'v4', value: THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
      stepSize: { type: 'v4', value: THREE.Vector4(0.0, 0.0, 0.0, 0.0) },
      texSize: { type: 'f', value: 0.0 },
      isoThreshold: { type: 'f', value: 0.0 },
      brightness3D: { type: 'f', value: 0.0 },
      contrast3D: { type: 'f', value: 0.0 },
      tileCountX: { type: 'f', value: 0.0 },
      volumeSizeZ: { type: 'f', value: 0.0 },
      opacityBarrier: { type: 'f', value: 0.0 },
    };
    this.m_defines = {
      isoRenderFlag: 0,
    };
  }

  /** Simple material constructor
  * @return {object} Three.js material with this shader
  */
  create(texVol2d, texBackface, texFrontface, renderTexture, callbackMat) {
    // Init uniforms
    this.m_uniforms.texVolume.value = texVol2d;
    this.m_uniforms.texBF.value = texBackface;
    this.m_uniforms.texFF.value = texFrontface;
    this.m_uniforms.texIsoSurface.value = renderTexture;

    // create shader loaders
    const vertexLoader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    vertexLoader.setResponseType('text');
    const fragmentLoader = new THREE.XHRLoader(THREE.DefaultLoadingManager);
    fragmentLoader.setResponseType('text');

    vertexLoader.load(VOL_RENDER_VERTEX_SHADER, (strVertexSh) => {
      this.m_strShaderVertex = strVertexSh;
      // console.log(`Load callback success. text = : ${strVertexSh} ...`);
      fragmentLoader.load(VOL_RENDER_FRAGMENT_SHADER, (strFragmentSh) => {
        this.m_strShaderFragment = strFragmentSh;

        // log
        // {
        //   const strLoaded = JSON.stringify(this.m_strShaderVertex);
        //   console.log(`Readed vertex shader is: ${strLoaded} ...`);
        // }

        const material = new THREE.ShaderMaterial({
          uniforms: this.m_uniforms,
          defines: this.m_defines,
          vertexShader: this.m_strShaderVertex,
          fragmentShader: this.m_strShaderFragment,
          side: THREE.BackSide
        });
        if (callbackMat) {
          callbackMat(material);
        }
      });
    });
  }
}