import React, { useEffect } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Navbar,
  Row,
  Spinner,
  Table
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { loadFilesData, selectFilesState, setSelectedFile } from '../store/filesSlice';
import { flattenFiles, sortFiles } from '../store/filesSelectors';

const h = React.createElement;

function formatNumber(value) {
  return new Intl.NumberFormat('en-US').format(value);
}

function App() {
  const dispatch = useDispatch();
  const {
    availableFiles,
    files,
    status,
    errorMessage,
    selectedFile
  } = useSelector(selectFilesState);

  function refreshFiles() {
    dispatch(loadFilesData());
  }

  function handleFileChange(event) {
    dispatch(setSelectedFile(event.target.value));
    dispatch(loadFilesData());
  }

  useEffect(() => {
    dispatch(loadFilesData());
  }, [dispatch]);

  const visibleFiles = sortFiles(files);
  const visibleRows = flattenFiles(visibleFiles);
  const availableFileOptions = availableFiles
    .slice()
    .sort((left, right) => left.localeCompare(right));

  return h(
    'div',
    { className: 'app-shell' },
    h(
      Navbar,
      { className: 'topbar', expand: 'lg' },
      h(
        Container,
        null,
        h(Navbar.Brand, { className: 'brand-mark' }, 'Files Dashboard')
      )
    ),
    h(
      Container,
      { className: 'py-4 py-lg-5' },
      [
        h(
          Row,
          { className: 'g-4', key: 'content-row' },
          [
            h(
              Col,
              { lg: 8, key: 'table-column' },
              h(
                Card,
                { className: 'panel-card h-100' },
                h(Card.Body, { className: 'p-4' }, [
                  h(
                    'div',
                    { className: 'section-heading', key: 'section-heading' },
                    [
                      h('div', { key: 'section-copy' }, [
                        h('div', { className: 'section-title', key: 'section-title' }, 'Data viewer'),
                        h('p', { className: 'section-copy', key: 'section-copy-text' }, 'Filtra por archivo y revisa las lineas aceptadas por el backend.')
                      ]),
                      h(
                        'div',
                        { className: 'controls-row', key: 'controls-row' },
                        [
                          h(Form.Select, {
                            'aria-label': 'Filtrar por archivo',
                            className: 'file-filter',
                            value: selectedFile,
                            onChange: handleFileChange,
                            key: 'file-filter'
                          }, [
                            h('option', { value: 'all', key: 'option-all' }, 'Todos los archivos')
                          ].concat(
                            availableFileOptions.map((fileName) => {
                              return h('option', { value: fileName, key: fileName }, fileName);
                            })
                          )),
                          h(
                            Button,
                            {
                              variant: 'outline-light',
                              className: 'refresh-button',
                              onClick: refreshFiles,
                              disabled: status === 'loading',
                              key: 'refresh-button'
                            },
                            status === 'loading' ? 'Cargando...' : 'Actualizar'
                          )
                        ]
                      )
                    ]
                  ),
                  status === 'error'
                    ? h(Alert, { variant: 'danger', className: 'status-alert', key: 'error-alert' }, errorMessage)
                    : null,
                  status === 'loading'
                    ? h(
                        'div',
                        { className: 'loading-state', key: 'loading-state' },
                        [
                          h(Spinner, { animation: 'border', role: 'status', key: 'loading-spinner' }),
                          h('span', { key: 'loading-text' }, 'Buscando el API y cargando archivos...')
                        ]
                      )
                    : h(
                        'div',
                        { className: 'table-wrapper', key: 'table-wrapper' },
                        h(
                          Table,
                          { responsive: true, className: 'mb-0 data-table' },
                          [
                            h('thead', { key: 'thead' },
                              h('tr', null, [
                                h('th', { key: 'head-file' }, 'File'),
                                h('th', { key: 'head-text' }, 'Text'),
                                h('th', { key: 'head-number' }, 'Number'),
                                h('th', { key: 'head-hex' }, 'Hex')
                              ])
                            ),
                            h(
                              'tbody',
                              { key: 'tbody' },
                              visibleRows.length > 0
                                ? visibleRows.map((row) => {
                                    return h('tr', { key: row.id }, [
                                      h('td', { className: 'mono-cell', key: `${row.id}-file` }, row.file),
                                      h('td', { key: `${row.id}-text` }, row.text || h('span', { className: 'empty-text' }, 'Empty text')),
                                      h('td', { className: 'mono-cell', key: `${row.id}-number` }, formatNumber(row.number)),
                                      h('td', { className: 'mono-cell hex-cell', key: `${row.id}-hex` }, row.hex)
                                    ]);
                                  })
                                : [
                                    h('tr', { key: 'empty-row' }, [
                                      h(
                                        'td',
                                        { colSpan: 4, className: 'empty-state-cell', key: 'empty-cell' },
                                        'No hay lineas para el filtro seleccionado.'
                                      )
                                    ])
                                  ]
                            )
                          ]
                        )
                      )
                ])
              )
            ),
            h(
              Col,
              { lg: 4, key: 'aside-column' },
              h(
                Card,
                { className: 'panel-card h-100' },
                h(Card.Body, { className: 'p-4' }, [
                  h('div', { className: 'section-title', key: 'aside-title' }, 'Resumen por archivo'),
                  h('p', { className: 'section-copy compact-copy', key: 'aside-copy' }, 'Cada tarjeta resume cuantas lineas validas expone el backend por archivo.'),
                  h(
                    'div',
                    { className: 'file-summary-list', key: 'summary-list' },
                    visibleFiles.length > 0
                      ? visibleFiles.map((fileEntry) => {
                          return h(
                            'div',
                            { className: 'file-summary-item', key: fileEntry.file },
                            [
                              h('div', { className: 'file-summary-name', key: `${fileEntry.file}-name` }, fileEntry.file),
                              h('div', { className: 'file-summary-meta', key: `${fileEntry.file}-meta` }, `${fileEntry.lines.length} lineas validas`)
                            ]
                          );
                        })
                      : h('div', { className: 'empty-summary' }, 'No hay archivos disponibles para mostrar.')
                  )
                ])
              )
            )
          ]
        )
      ]
    )
  );
}

export { App };
