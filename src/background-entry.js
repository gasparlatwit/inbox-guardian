// rebundle after editting and save as "background"
import * as tf from '@tensorflow/tfjs';

// START DEBUG
const DEBUG = true;
const DEBUG_VERBOSE = false;

function debugLog(message, data = null) {
  if (DEBUG) {
    console.log(`[BACKGROUND] ${message}`, data);
  }
}

function debugError(message, error) {
  if (DEBUG) {
    console.error(`[BACKGROUND ERROR] ${message}`, error);
  }
}

debugLog('Service worker started');
// END DEBUG


let model = null;
let wordIndex = null;

// load model and wordlist
async function loadModelAndIndex() {
  try {
    console.log('Loading model and word index...');
    
    model = await tf.loadLayersModel(chrome.runtime.getURL('../model/model.json'));
    
    const response = await fetch(chrome.runtime.getURL('../model/word_index.json'));
    wordIndex = await response.json();
    
    console.log('Model and word index loaded');
  } catch (error) {
    console.error('Error loading model or word index:', error);
  }
}

// start backgound on startup
loadModelAndIndex();

// preprocessing body to match model
function preprocessText(text) {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, '');
  const words = cleaned.split(/\s+/);
  const seq = words.map(word => wordIndex[word] || 1);
  const maxLen = 80;
  return seq.length > maxLen ? seq.slice(0, maxLen) : Array(maxLen - seq.length).fill(0).concat(seq);
}

// listen for analyze email message
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'ANALYZE_EMAIL') {
    analyzeEmail(message.emailData, sendResponse);
    return true;
  }
});

async function analyzeEmail(emailData, sendResponse) {
  try {
    // check if model/wordlist loaded
    if (!model || !wordIndex) {
      await loadModelAndIndex();
    }
    
    if (!model || !wordIndex) {
      sendResponse({
        success: false,
        error: 'Model not ready'
      });
      return;
    }
    
    // preproceses
    const inputSeq = preprocessText(emailData.body);
    const inputTensor = tf.tensor2d([inputSeq], [1, 80]);
    
    // predict
    const prediction = model.predict(inputTensor);
    const data = await prediction.data();
    const score = data[0];
    
    // clean
    inputTensor.dispose();
    prediction.dispose();
    
    // send response
    // change classification here!
    sendResponse({
      success: true,
      score: score,
      isPhishing: score > 0.5,
      confidence: score > 0.5 ? (score * 100).toFixed(2) : ((1 - score) * 100).toFixed(2),
      emailData: emailData
    });
    
  } catch (error) {
    console.error('Error analyzing email:', error);
    sendResponse({
      success: false,
      error: error.message
    });
  }
}