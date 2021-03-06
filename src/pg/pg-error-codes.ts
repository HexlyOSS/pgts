
export default class PgErrorCode {
  constructor(
    public key: string,
    public code: string,
		public type: string,
		public category: string,
    public classification: () => PgErrorClassification
  ){}

  static from(key?: string){
		if(!key){
			return null
		}
    if( cached[key] ){
      return cached[key]
    }

    const classification = classifications.find(c => !!c.codes[key])
    if( !classification ){
      return null
    }
    const code = classification.codes[key]

    const result = new PgErrorCode(key, code, classification.classification, classification.title, () => classification)

    cached[key] = result
    return result
  }
}


export interface PgErrorClassification {
  classification: string,
  title: string, 
  codes: Record<string, string>
}


export const classifications: PgErrorClassification[] = [{
	"classification": "00",
	"title": "Successful Completion",
	"codes": {
		"00000": "successful_completion"
	}
}, {
	"classification": "01",
	"title": "Warning",
	"codes": {
		"01000": "warning",
		"0100C": "dynamic_result_sets_returned",
		"01008": "implicit_zero_bit_padding",
		"01003": "null_value_eliminated_in_set_function",
		"01007": "privilege_not_granted",
		"01006": "privilege_not_revoked",
		"01004": "string_data_right_truncation",
		"01P01": "deprecated_feature"
	}
}, {
	"classification": "02",
	"title": "No Data (this is also a warning class per the SQL standard)",
	"codes": {
		"02000": "no_data",
		"02001": "no_additional_dynamic_result_sets_returned"
	}
}, {
	"classification": "03",
	"title": "SQL Statement Not Yet Complete",
	"codes": {
		"03000": "sql_statement_not_yet_complete"
	}
}, {
	"classification": "08",
	"title": "Connection Exception",
	"codes": {
		"08000": "connection_exception",
		"08003": "connection_does_not_exist",
		"08006": "connection_failure",
		"08001": "sqlclient_unable_to_establish_sqlconnection",
		"08004": "sqlserver_rejected_establishment_of_sqlconnection",
		"08007": "transaction_resolution_unknown",
		"08P01": "protocol_violation"
	}
}, {
	"classification": "09",
	"title": "Triggered Action Exception0",
	"codes": {
		"09000": "triggered_action_exception"
	}
}, {
	"classification": "0A",
	"title": "Feature Not Supported",
	"codes": {
		"0A000": "feature_not_supported"
	}
}, {
	"classification": "0B",
	"title": "Invalid Transaction Initiation",
	"codes": {
		"0B000": "invalid_transaction_initiation"
	}
}, {
	"classification": "0F",
	"title": "Locator Exception",
	"codes": {
		"0F000": "locator_exception",
		"0F001": "invalid_locator_specification"
	}
}, {
	"classification": "0L",
	"title": "Invalid Grantor",
	"codes": {
		"0L000": "invalid_grantor",
		"0LP01": "invalid_grant_operation"
	}
}, {
	"classification": "0P",
	"title": "Invalid Role Specification",
	"codes": {
		"0P000": "invalid_role_specification"
	}
}, {
	"classification": "0Z",
	"title": "Diagnostics Exception",
	"codes": {
		"0Z000": "diagnostics_exception",
		"0Z002": "stacked_diagnostics_accessed_without_active_handler"
	}
}, {
	"classification": "20",
	"title": "Case Not Found",
	"codes": {
		"20000": "case_not_found"
	}
}, {
	"classification": "21",
	"title": "Cardinality Violation",
	"codes": {
		"21000": "cardinality_violation"
	}
}, {
	"classification": "22",
	"title": "Data Exception",
	"codes": {
		"22000": "data_exception",
		"2202E": "array_subscript_error",
		"22021": "character_not_in_repertoire",
		"22008": "datetime_field_overflow",
		"22012": "division_by_zero",
		"22005": "error_in_assignment",
		"2200B": "escape_character_conflict",
		"22022": "indicator_overflow",
		"22015": "interval_field_overflow",
		"2201E": "invalid_argument_for_logarithm",
		"22014": "invalid_argument_for_ntile_function",
		"22016": "invalid_argument_for_nth_value_function",
		"2201F": "invalid_argument_for_power_function",
		"2201G": "invalid_argument_for_width_bucket_function",
		"22018": "invalid_character_value_for_cast",
		"22007": "invalid_datetime_format",
		"22019": "invalid_escape_character",
		"2200D": "invalid_escape_octet",
		"22025": "invalid_escape_sequence",
		"22P06": "nonstandard_use_of_escape_character",
		"22010": "invalid_indicator_parameter_value",
		"22023": "invalid_parameter_value",
		"22013": "invalid_preceding_or_following_size",
		"2201B": "invalid_regular_expression",
		"2201W": "invalid_row_count_in_limit_clause",
		"2201X": "invalid_row_count_in_result_offset_clause",
		"2202H": "invalid_tablesample_argument",
		"2202G": "invalid_tablesample_repeat",
		"22009": "invalid_time_zone_displacement_value",
		"2200C": "invalid_use_of_escape_character",
		"2200G": "most_specific_type_mismatch",
		"22004": "null_value_not_allowed",
		"22002": "null_value_no_indicator_parameter",
		"22003": "numeric_value_out_of_range",
		"2200H": "sequence_generator_limit_exceeded",
		"22026": "string_data_length_mismatch",
		"22001": "string_data_right_truncation",
		"22011": "substring_error",
		"22027": "trim_error",
		"22024": "unterminated_c_string",
		"2200F": "zero_length_character_string",
		"22P01": "floating_point_exception",
		"22P02": "invalid_text_representation",
		"22P03": "invalid_binary_representation",
		"22P04": "bad_copy_file_format",
		"22P05": "untranslatable_character",
		"2200L": "not_an_xml_document",
		"2200M": "invalid_xml_document",
		"2200N": "invalid_xml_content",
		"2200S": "invalid_xml_comment",
		"2200T": "invalid_xml_processing_instruction",
		"22030": "duplicate_json_object_key_value",
		"22031": "invalid_argument_for_sql_json_datetime_function",
		"22032": "invalid_json_text",
		"22033": "invalid_sql_json_subscript",
		"22034": "more_than_one_sql_json_item",
		"22035": "no_sql_json_item",
		"22036": "non_numeric_sql_json_item",
		"22037": "non_unique_keys_in_a_json_object",
		"22038": "singleton_sql_json_item_required",
		"22039": "sql_json_array_not_found",
		"2203A": "sql_json_member_not_found",
		"2203B": "sql_json_number_not_found",
		"2203C": "sql_json_object_not_found",
		"2203D": "too_many_json_array_elements",
		"2203E": "too_many_json_object_members",
		"2203F": "sql_json_scalar_required"
	}
}, {
	"classification": "23",
	"title": "Integrity Constraint Violation",
	"codes": {
		"23000": "integrity_constraint_violation",
		"23001": "restrict_violation",
		"23502": "not_null_violation",
		"23503": "foreign_key_violation",
		"23505": "unique_violation",
		"23514": "check_violation",
		"23P01": "exclusion_violation"
	}
}, {
	"classification": "24",
	"title": "Invalid Cursor State",
	"codes": {
		"24000": "invalid_cursor_state"
	}
}, {
	"classification": "25",
	"title": "Invalid Transaction State",
	"codes": {
		"25000": "invalid_transaction_state",
		"25001": "active_sql_transaction",
		"25002": "branch_transaction_already_active",
		"25008": "held_cursor_requires_same_isolation_level",
		"25003": "inappropriate_access_mode_for_branch_transaction",
		"25004": "inappropriate_isolation_level_for_branch_transaction",
		"25005": "no_active_sql_transaction_for_branch_transaction",
		"25006": "read_only_sql_transaction",
		"25007": "schema_and_data_statement_mixing_not_supported",
		"25P01": "no_active_sql_transaction",
		"25P02": "in_failed_sql_transaction",
		"25P03": "idle_in_transaction_session_timeout"
	}
}, {
	"classification": "26",
	"title": "Invalid SQL Statement Name",
	"codes": {
		"26000": "invalid_sql_statement_name"
	}
}, {
	"classification": "27",
	"title": "Triggered Data Change Violation",
	"codes": {
		"27000": "triggered_data_change_violation"
	}
}, {
	"classification": "28",
	"title": "Invalid Authorization Specification",
	"codes": {
		"28000": "invalid_authorization_specification",
		"28P01": "invalid_password"
	}
}, {
	"classification": "2B",
	"title": "Dependent Privilege Descriptors Still Exist",
	"codes": {
		"2B000": "dependent_privilege_descriptors_still_exist",
		"2BP01": "dependent_objects_still_exist"
	}
}, {
	"classification": "2D",
	"title": "Invalid Transaction Termination",
	"codes": {
		"2D000": "invalid_transaction_termination"
	}
}, {
	"classification": "2F",
	"title": "SQL Routine Exception",
	"codes": {
		"2F000": "sql_routine_exception",
		"2F005": "function_executed_no_return_statement",
		"2F002": "modifying_sql_data_not_permitted",
		"2F003": "prohibited_sql_statement_attempted",
		"2F004": "reading_sql_data_not_permitted"
	}
}, {
	"classification": "34",
	"title": "Invalid Cursor Name",
	"codes": {
		"34000": "invalid_cursor_name"
	}
}, {
	"classification": "38",
	"title": "External Routine Exception",
	"codes": {
		"38000": "external_routine_exception",
		"38001": "containing_sql_not_permitted",
		"38002": "modifying_sql_data_not_permitted",
		"38003": "prohibited_sql_statement_attempted",
		"38004": "reading_sql_data_not_permitted"
	}
}, {
	"classification": "39",
	"title": "External Routine Invocation Exception",
	"codes": {
		"39000": "external_routine_invocation_exception",
		"39001": "invalid_sqlstate_returned",
		"39004": "null_value_not_allowed",
		"39P01": "trigger_protocol_violated",
		"39P02": "srf_protocol_violated",
		"39P03": "event_trigger_protocol_violated"
	}
}, {
	"classification": "3B",
	"title": "Savepoint Exception",
	"codes": {
		"3B000": "savepoint_exception",
		"3B001": "invalid_savepoint_specification"
	}
}, {
	"classification": "3D",
	"title": "Invalid Catalog Name",
	"codes": {
		"3D000": "invalid_catalog_name"
	}
}, {
	"classification": "3F",
	"title": "Invalid Schema Name",
	"codes": {
		"3F000": "invalid_schema_name"
	}
}, {
	"classification": "40",
	"title": "Transaction Rollback",
	"codes": {
		"40000": "transaction_rollback",
		"40002": "transaction_integrity_constraint_violation",
		"40001": "serialization_failure",
		"40003": "statement_completion_unknown",
		"40P01": "deadlock_detected"
	}
}, {
	"classification": "42",
	"title": "Syntax Error or Access Rule Violation",
	"codes": {
		"42000": "syntax_error_or_access_rule_violation",
		"42601": "syntax_error",
		"42501": "insufficient_privilege",
		"42846": "cannot_coerce",
		"42803": "grouping_error",
		"42P20": "windowing_error",
		"42P19": "invalid_recursion",
		"42830": "invalid_foreign_key",
		"42602": "invalid_name",
		"42622": "name_too_long",
		"42939": "reserved_name",
		"42804": "datatype_mismatch",
		"42P18": "indeterminate_datatype",
		"42P21": "collation_mismatch",
		"42P22": "indeterminate_collation",
		"42809": "wrong_object_type",
		"428C9": "generated_always",
		"42703": "undefined_column",
		"42883": "undefined_function",
		"42P01": "undefined_table",
		"42P02": "undefined_parameter",
		"42704": "undefined_object",
		"42701": "duplicate_column",
		"42P03": "duplicate_cursor",
		"42P04": "duplicate_database",
		"42723": "duplicate_function",
		"42P05": "duplicate_prepared_statement",
		"42P06": "duplicate_schema",
		"42P07": "duplicate_table",
		"42712": "duplicate_alias",
		"42710": "duplicate_object",
		"42702": "ambiguous_column",
		"42725": "ambiguous_function",
		"42P08": "ambiguous_parameter",
		"42P09": "ambiguous_alias",
		"42P10": "invalid_column_reference",
		"42611": "invalid_column_definition",
		"42P11": "invalid_cursor_definition",
		"42P12": "invalid_database_definition",
		"42P13": "invalid_function_definition",
		"42P14": "invalid_prepared_statement_definition",
		"42P15": "invalid_schema_definition",
		"42P16": "invalid_table_definition",
		"42P17": "invalid_object_definition"
	}
}, {
	"classification": "44",
	"title": "WITH CHECK OPTION Violation",
	"codes": {
		"44000": "with_check_option_violation"
	}
}, {
	"classification": "53",
	"title": "Insufficient Resources",
	"codes": {
		"53000": "insufficient_resources",
		"53100": "disk_full",
		"53200": "out_of_memory",
		"53300": "too_many_connections",
		"53400": "configuration_limit_exceeded"
	}
}, {
	"classification": "54",
	"title": "Program Limit Exceeded",
	"codes": {
		"54000": "program_limit_exceeded",
		"54001": "statement_too_complex",
		"54011": "too_many_columns",
		"54023": "too_many_arguments"
	}
}, {
	"classification": "55",
	"title": "Object Not In Prerequisite State",
	"codes": {
		"55000": "object_not_in_prerequisite_state",
		"55006": "object_in_use",
		"55P02": "cant_change_runtime_param",
		"55P03": "lock_not_available",
		"55P04": "unsafe_new_enum_value_usage"
	}
}, {
	"classification": "57",
	"title": "Operator Intervention",
	"codes": {
		"57000": "operator_intervention",
		"57014": "query_canceled",
		"57P01": "admin_shutdown",
		"57P02": "crash_shutdown",
		"57P03": "cannot_connect_now",
		"57P04": "database_dropped"
	}
}, {
	"classification": "58",
	"title": "System Error (errors external to PostgreSQL itself)",
	"codes": {
		"58000": "system_error",
		"58030": "io_error",
		"58P01": "undefined_file",
		"58P02": "duplicate_file"
	}
}, {
	"classification": "72",
	"title": "Snapshot Failure",
	"codes": {
		"72000": "snapshot_too_old"
	}
}, {
	"classification": "F0",
	"title": "Configuration File Error",
	"codes": {
		"F0000": "config_file_error",
		"F0001": "lock_file_exists"
	}
}, {
	"classification": "HV",
	"title": "Foreign Data Wrapper Error (SQL/MED)",
	"codes": {
		"HV000": "fdw_error",
		"HV005": "fdw_column_name_not_found",
		"HV002": "fdw_dynamic_parameter_value_needed",
		"HV010": "fdw_function_sequence_error",
		"HV021": "fdw_inconsistent_descriptor_information",
		"HV024": "fdw_invalid_attribute_value",
		"HV007": "fdw_invalid_column_name",
		"HV008": "fdw_invalid_column_number",
		"HV004": "fdw_invalid_data_type",
		"HV006": "fdw_invalid_data_type_descriptors",
		"HV091": "fdw_invalid_descriptor_field_identifier",
		"HV00B": "fdw_invalid_handle",
		"HV00C": "fdw_invalid_option_index",
		"HV00D": "fdw_invalid_option_name",
		"HV090": "fdw_invalid_string_length_or_buffer_length",
		"HV00A": "fdw_invalid_string_format",
		"HV009": "fdw_invalid_use_of_null_pointer",
		"HV014": "fdw_too_many_handles",
		"HV001": "fdw_out_of_memory",
		"HV00P": "fdw_no_schemas",
		"HV00J": "fdw_option_name_not_found",
		"HV00K": "fdw_reply_handle",
		"HV00Q": "fdw_schema_not_found",
		"HV00R": "fdw_table_not_found",
		"HV00L": "fdw_unable_to_create_execution",
		"HV00M": "fdw_unable_to_create_reply",
		"HV00N": "fdw_unable_to_establish_connection"
	}
}, {
	"classification": "P0",
	"title": "PL/pgSQL Error",
	"codes": {
		"P0000": "plpgsql_error",
		"P0001": "raise_exception",
		"P0002": "no_data_found",
		"P0003": "too_many_rows",
		"P0004": "assert_failure"
	}
}, {
	"classification": "XX",
	"title": "Internal Error",
	"codes": {
		"XX000": "internal_error",
		"XX001": "data_corrupted",
		"XX002": "index_corrupted"
	}
}]

const cached: Record<string, PgErrorCode> = {}
