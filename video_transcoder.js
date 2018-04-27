'use strict';

const presetId = {
  p720Web: '1351620000001-100070',
  p720:    '1351620000001-000010',
  p1080:   '1351620000001-000001'
}
const suffix = '.mp4'

var AWS = require('aws-sdk');

var elasticTranscoder = new AWS.ElasticTranscoder({
  region: 'us-east-1'
});

exports.handler = function(event, context, callback) {

  var key = event.Records[0].s3.object.key;
  var sourceKey = decodeURIComponent(key.replace(/\+/g, " "));
  var outputKey = sourceKey.split('.')[0];

  console.log('key: ', key, sourceKey, outputKey);

  var params = {
    PipelineId: 'hoge',
    OutputKeyPrefix: outputKey + '/',
    Input: {
      Key: sourceKey
    },
    Outputs: [
    {
      Key: outputKey + '-1080p' + suffix,
      PresetId: presetId.p720Web
    },
    {
      Key: outputKey + '-720p' + suffix,
      PresetId: presetId.p720
    },
    {
      Key: outputKey + '-web-720p' + suffix,
      PresetId: presetId.p1080
    }
  ]};
  elasticTranscoder.createJob(params, function(error, data) {
    if (error) {
      callback(error);
    }
  });
};
