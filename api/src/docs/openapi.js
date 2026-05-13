const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Files API',
    version: '1.0.0',
    description: 'REST API that retrieves external CSV files, filters invalid rows, and exposes the data as JSON.'
  },
  servers: [
    {
      url: '/'
    }
  ],
  tags: [
    {
      name: 'Files',
      description: 'Operations for listing files and retrieving parsed data'
    }
  ],
  paths: {
    '/files/list': {
      get: {
        tags: ['Files'],
        summary: 'List available files',
        description: 'Returns the raw file list exposed by the external service.',
        responses: {
          200: {
            description: 'Available file names',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/FilesListResponse'
                },
                example: {
                  files: ['test1.csv', 'test2.csv']
                }
              }
            }
          },
          502: {
            description: 'External files list could not be fetched',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                  error: 'Failed to fetch remote files list'
                }
              }
            }
          }
        }
      }
    },
    '/files/data': {
      get: {
        tags: ['Files'],
        summary: 'Get parsed file data',
        description: 'Returns all valid CSV rows, or only the selected file when the fileName query parameter is provided.',
        parameters: [
          {
            name: 'fileName',
            in: 'query',
            required: false,
            description: 'Optional file name filter',
            schema: {
              type: 'string'
            },
            example: 'test1.csv'
          }
        ],
        responses: {
          200: {
            description: 'Parsed file data',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/FileDataEntry'
                  }
                },
                example: [
                  {
                    file: 'test1.csv',
                    lines: [
                      {
                        text: 'RgTya',
                        number: 64075909,
                        hex: '70ad29aacf0b690b0467fe2b2767f765'
                      }
                    ]
                  }
                ]
              }
            }
          },
          502: {
            description: 'External file data could not be fetched',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ErrorResponse'
                },
                example: {
                  error: 'Failed to fetch remote files'
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      FilesListResponse: {
        type: 'object',
        required: ['files'],
        properties: {
          files: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
        }
      },
      FileLine: {
        type: 'object',
        required: ['text', 'number', 'hex'],
        properties: {
          text: {
            type: 'string'
          },
          number: {
            type: 'integer'
          },
          hex: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{32}$'
          }
        }
      },
      FileDataEntry: {
        type: 'object',
        required: ['file', 'lines'],
        properties: {
          file: {
            type: 'string'
          },
          lines: {
            type: 'array',
            items: {
              $ref: '#/components/schemas/FileLine'
            }
          }
        }
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string'
          }
        }
      }
    }
  }
}

module.exports = openApiSpec
