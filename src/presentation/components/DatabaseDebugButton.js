import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import db from '../../data/database/connection';
import { crearTablas } from '../../data/database/tablas';

const MAX_ROWS_PER_TABLE = 20;

function quoteIdentifier(identifier) {
    return `"${String(identifier).replace(/"/g, '""')}"`;
}

function formatValue(value) {
    if (value === null || value === undefined) {
        return 'null';
    }

    if (typeof value === 'object') {
        return JSON.stringify(value);
    }

    return String(value);
}

export function DatabaseDebugButton() {
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snapshot, setSnapshot] = useState(null);
    const [error, setError] = useState(null);

    const loadDatabaseSnapshot = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            crearTablas();

            const versionRow = await db.getFirstAsync('SELECT sqlite_version() AS version');
            const databaseFiles = await db.getAllAsync('PRAGMA database_list');
            const tables = await db.getAllAsync(`
                SELECT name
                FROM sqlite_master
                WHERE type = 'table'
                  AND name NOT LIKE 'sqlite_%'
                ORDER BY name
            `);

            const tableSnapshots = [];

            for (const table of tables) {
                const tableName = table.name;
                const quotedTableName = quoteIdentifier(tableName);
                const countRow = await db.getFirstAsync(`SELECT COUNT(*) AS total FROM ${quotedTableName}`);
                const columns = await db.getAllAsync(`PRAGMA table_info(${quotedTableName})`);
                const rows = await db.getAllAsync(
                    `SELECT * FROM ${quotedTableName} LIMIT ?`,
                    [MAX_ROWS_PER_TABLE]
                );

                tableSnapshots.push({
                    name: tableName,
                    total: countRow?.total ?? 0,
                    columns,
                    rows,
                });
            }

            setSnapshot({
                checkedAt: new Date().toLocaleString(),
                sqliteVersion: versionRow?.version ?? 'desconocida',
                databaseFiles,
                tables: tableSnapshots,
            });
        } catch (snapshotError) {
            setError(snapshotError.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const openPanel = () => {
        setVisible(true);
        loadDatabaseSnapshot();
    };

    return (
        <>
            <TouchableOpacity
                accessibilityLabel="Abrir diagnostico de base de datos"
                activeOpacity={0.85}
                style={styles.floatingButton}
                onPress={openPanel}
            >
                <Text style={styles.floatingButtonText}>BD</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                visible={visible}
                onRequestClose={() => setVisible(false)}
            >
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Base de datos</Text>
                            <Text style={styles.subtitle}>indicador.db</Text>
                        </View>

                        <Pressable style={styles.closeButton} onPress={() => setVisible(false)}>
                            <Text style={styles.closeButtonText}>Cerrar</Text>
                        </Pressable>
                    </View>

                    <View style={styles.actions}>
                        <Pressable style={styles.refreshButton} onPress={loadDatabaseSnapshot} disabled={loading}>
                            <Text style={styles.refreshButtonText}>Actualizar</Text>
                        </Pressable>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#2563EB" />
                            <Text style={styles.loadingText}>Revisando conexion y tablas...</Text>
                        </View>
                    ) : (
                        <ScrollView contentContainerStyle={styles.content}>
                            {error ? (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorTitle}>Error de conexion o consulta</Text>
                                    <Text selectable style={styles.errorText}>{error}</Text>
                                </View>
                            ) : null}

                            {snapshot ? (
                                <>
                                    <View style={styles.statusBox}>
                                        <Text style={styles.statusText}>Conexion: OK</Text>
                                        <Text style={styles.metaText}>SQLite: {snapshot.sqliteVersion}</Text>
                                        <Text style={styles.metaText}>Actualizado: {snapshot.checkedAt}</Text>
                                        {snapshot.databaseFiles.map((databaseFile) => (
                                            <Text
                                                selectable
                                                key={`${databaseFile.seq}-${databaseFile.name}`}
                                                style={styles.metaText}
                                            >
                                                Archivo: {databaseFile.file || '(sin ruta disponible)'}
                                            </Text>
                                        ))}
                                    </View>

                                    {snapshot.tables.length === 0 ? (
                                        <Text style={styles.emptyText}>No hay tablas creadas.</Text>
                                    ) : (
                                        snapshot.tables.map((table) => (
                                            <View key={table.name} style={styles.tableSection}>
                                                <Text style={styles.tableTitle}>{table.name}</Text>
                                                <Text style={styles.metaText}>
                                                    Registros: {table.total} | Mostrando: {table.rows.length}
                                                </Text>

                                                <Text style={styles.sectionLabel}>Columnas</Text>
                                                <View style={styles.columnsWrap}>
                                                    {table.columns.map((column) => (
                                                        <Text key={column.cid} style={styles.columnPill}>
                                                            {column.name}: {column.type || 'ANY'}
                                                        </Text>
                                                    ))}
                                                </View>

                                                <Text style={styles.sectionLabel}>Filas</Text>
                                                {table.rows.length === 0 ? (
                                                    <Text style={styles.emptyText}>Sin registros.</Text>
                                                ) : (
                                                    table.rows.map((row, index) => (
                                                        <View key={`${table.name}-${index}`} style={styles.rowBox}>
                                                            {Object.entries(row).map(([key, value]) => (
                                                                <Text selectable key={key} style={styles.rowText}>
                                                                    {key}: {formatValue(value)}
                                                                </Text>
                                                            ))}
                                                        </View>
                                                    ))
                                                )}
                                            </View>
                                        ))
                                    )}
                                </>
                            ) : null}
                        </ScrollView>
                    )}
                </SafeAreaView>
            </Modal>
        </>
    );
}

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        right: 18,
        bottom: 28,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 8,
    },
    floatingButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 18,
        paddingVertical: 14,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    title: {
        fontSize: 22,
        fontWeight: '700',
        color: '#0F172A',
    },
    subtitle: {
        marginTop: 2,
        fontSize: 14,
        color: '#64748B',
    },
    closeButton: {
        minHeight: 40,
        paddingHorizontal: 14,
        borderRadius: 8,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#0F172A',
        fontWeight: '700',
    },
    actions: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    refreshButton: {
        height: 44,
        borderRadius: 8,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    refreshButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#475569',
        fontSize: 15,
    },
    content: {
        padding: 18,
        paddingBottom: 36,
    },
    statusBox: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: '#DCFCE7',
        borderWidth: 1,
        borderColor: '#86EFAC',
        marginBottom: 14,
    },
    statusText: {
        color: '#166534',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    metaText: {
        color: '#475569',
        fontSize: 13,
        lineHeight: 19,
    },
    errorBox: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: '#FEE2E2',
        borderWidth: 1,
        borderColor: '#FCA5A5',
        marginBottom: 14,
    },
    errorTitle: {
        color: '#991B1B',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 6,
    },
    errorText: {
        color: '#7F1D1D',
        fontSize: 13,
        lineHeight: 19,
    },
    tableSection: {
        padding: 14,
        borderRadius: 8,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 14,
    },
    tableTitle: {
        color: '#0F172A',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    sectionLabel: {
        color: '#334155',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 12,
        marginBottom: 8,
    },
    columnsWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    columnPill: {
        color: '#1E293B',
        backgroundColor: '#E0F2FE',
        borderRadius: 8,
        overflow: 'hidden',
        paddingHorizontal: 9,
        paddingVertical: 5,
        fontSize: 12,
    },
    rowBox: {
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 8,
    },
    rowText: {
        color: '#334155',
        fontSize: 12,
        lineHeight: 18,
    },
    emptyText: {
        color: '#64748B',
        fontSize: 14,
        fontStyle: 'italic',
    },
});
