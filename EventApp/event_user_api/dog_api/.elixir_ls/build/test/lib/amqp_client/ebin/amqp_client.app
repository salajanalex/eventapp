{application,amqp_client,
             [{description,"RabbitMQ AMQP Client"},
              {vsn,"3.6.2"},
              {modules,['amqp_auth_mechanisms 3',amqp_auth_mechanisms,
                        'amqp_channel 3',amqp_channel,'amqp_channel_sup 3',
                        amqp_channel_sup,'amqp_channel_sup_sup 3',
                        amqp_channel_sup_sup,'amqp_channels_manager 3',
                        amqp_channels_manager,'amqp_client 3',amqp_client,
                        'amqp_connection 3',amqp_connection,
                        'amqp_connection_sup 3',amqp_connection_sup,
                        'amqp_connection_type_sup 3',amqp_connection_type_sup,
                        'amqp_direct_connection 3',amqp_direct_connection,
                        'amqp_direct_consumer 3',amqp_direct_consumer,
                        'amqp_gen_connection 3',amqp_gen_connection,
                        'amqp_gen_consumer 2','amqp_gen_consumer 3',
                        amqp_gen_consumer,'amqp_main_reader 3',
                        amqp_main_reader,'amqp_network_connection 3',
                        amqp_network_connection,'amqp_rpc_client 3',
                        amqp_rpc_client,'amqp_rpc_server 3',amqp_rpc_server,
                        'amqp_selective_consumer 3',amqp_selective_consumer,
                        'amqp_sup 3',amqp_sup,'amqp_uri 3',amqp_uri,
                        'rabbit_ct_client_helpers 3',rabbit_ct_client_helpers,
                        'rabbit_routing_util 3',rabbit_routing_util,
                        'uri_parser 3',uri_parser]},
              {registered,[amqp_sup]},
              {env,[{prefer_ipv6,false},{ssl_options,[]}]},
              {mod,{amqp_client,[]}},
              {applications,[kernel,stdlib,xmerl,rabbit_common]}]}.
