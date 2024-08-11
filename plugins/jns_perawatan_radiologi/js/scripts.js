jQuery().ready(function () {
    var var_tbl_jns_perawatan_radiologi = $('#tbl_jns_perawatan_radiologi').DataTable({
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        'dom': 'Bfrtip',
        'searching': false,
        'select': true,
        'colReorder': true,
        "bInfo" : false,
        "ajax": {
            "url": "{?=url(['jns_perawatan_radiologi','data'])?}",
            "dataType": "json",
            "type": "POST",
            "data": function (data) {

                // Read values
                var search_field_jns_perawatan_radiologi = $('#search_field_jns_perawatan_radiologi').val();
                var search_text_jns_perawatan_radiologi = $('#search_text_jns_perawatan_radiologi').val();
                
                data.search_field_jns_perawatan_radiologi = search_field_jns_perawatan_radiologi;
                data.search_text_jns_perawatan_radiologi = search_text_jns_perawatan_radiologi;
                
            }
        },
        "columns": [
            { 'data': 'kd_jenis_prw' },
            { 'data': 'nm_perawatan' },
            { 'data': 'bagian_rs' },
            { 'data': 'bhp' },
            { 'data': 'tarif_perujuk' },
            { 'data': 'tarif_tindakan_dokter' },
            { 'data': 'tarif_tindakan_petugas' },
            { 'data': 'kso' },
            { 'data': 'menejemen' },
            { 'data': 'total_byr' },
            { 'data': 'kd_pj' },
            { 'data': 'status', 
                "render": function (data) {
                    if(data == '1') {
                        var status = 'Aktif';
                    } else {
                        var status = 'Tidak Aktif';
                    }
                    return status;
                }      
            },
            { 'data': 'kelas' }
        ],
        "columnDefs": [
            { 'targets': 0},
            { 'targets': 1},
            { 'targets': 2},
            { 'targets': 3},
            { 'targets': 4},
            { 'targets': 5},
            { 'targets': 6},
            { 'targets': 7},
            { 'targets': 8},
            { 'targets': 9},
            { 'targets': 10},
            { 'targets': 11},
            { 'targets': 12}
        ],
        order: [[1, 'DESC']], 
        buttons: [],
        "scrollCollapse": true,
        // "scrollY": '48vh', 
        // "pageLength":'25', 
        "lengthChange": true,
        "scrollX": true,
        dom: "<'row'<'col-sm-12'tr>><<'pmd-datatable-pagination' l i p>>"
    });


    $.contextMenu({
        selector: '#tbl_jns_perawatan_radiologi tr', 
        trigger: 'right',
        callback: function(key, options) {
          var rowData = var_tbl_jns_perawatan_radiologi.rows({ selected: true }).data()[0];
          if (rowData != null) {
            var kd_jenis_prw = rowData['kd_jenis_prw'];
            switch (key) {
                case 'detail' :
                    OpenModal(mlite.url + '/jns_perawatan_radiologi/detail/' + kd_jenis_prw + '?t=' + mlite.token);
                break;
                default :
                break
            } 
          } else {
            bootbox.alert("Silakan pilih data atau klik baris data.");            
          }          
        },
        items: {
            "detail": {name: "View Detail", "icon": "edit", disabled:  {$disabled_menu.read}}
        }
    });

    // ==============================================================
    // FORM VALIDASI
    // ==============================================================

    $("form[name='form_jns_perawatan_radiologi']").validate({
        rules: {
            kd_jenis_prw: 'required',
            nm_perawatan: 'required',
            bagian_rs: 'required',
            bhp: 'required',
            tarif_perujuk: 'required',
            tarif_tindakan_dokter: 'required',
            tarif_tindakan_petugas: 'required',
            kso: 'required',
            menejemen: 'required',
            total_byr: 'required',
            kd_pj: 'required',
            status: 'required',
            kelas: 'required'
        },
        messages: {
            kd_jenis_prw:'Kd Jenis Prw tidak boleh kosong!',
            nm_perawatan:'Nm Perawatan tidak boleh kosong!',
            bagian_rs:'Bagian Rs tidak boleh kosong!',
            bhp:'Bhp tidak boleh kosong!',
            tarif_perujuk:'Tarif Perujuk tidak boleh kosong!',
            tarif_tindakan_dokter:'Tarif Tindakan Dokter tidak boleh kosong!',
            tarif_tindakan_petugas:'Tarif Tindakan Petugas tidak boleh kosong!',
            kso:'Kso tidak boleh kosong!',
            menejemen:'Menejemen tidak boleh kosong!',
            total_byr:'Total Byr tidak boleh kosong!',
            kd_pj:'Kd Pj tidak boleh kosong!',
            status:'Status tidak boleh kosong!',
            kelas:'Kelas tidak boleh kosong!'
        },
        submitHandler: function (form) {
            var kd_jenis_prw= $('#kd_jenis_prw').val();
            var nm_perawatan= $('#nm_perawatan').val();
            var bagian_rs= $('#bagian_rs').val();
            var bhp= $('#bhp').val();
            var tarif_perujuk= $('#tarif_perujuk').val();
            var tarif_tindakan_dokter= $('#tarif_tindakan_dokter').val();
            var tarif_tindakan_petugas= $('#tarif_tindakan_petugas').val();
            var kso= $('#kso').val();
            var menejemen= $('#menejemen').val();
            var total_byr= $('#total_byr').val();
            var kd_pj= $('#kd_pj').val();
            var status= $('#status').val();
            var kelas= $('#kelas').val();

            var typeact = $('#typeact').val();

            var formData = new FormData(form); // tambahan
            formData.append('typeact', typeact); // tambahan

            $.ajax({
                url: "{?=url(['jns_perawatan_radiologi','aksi'])?}",
                method: "POST",
                contentType: false, // tambahan
                processData: false, // tambahan
                data: formData,
                success: function (data) {
                    data = JSON.parse(data);
                    var audio = new Audio('{?=url()?}/assets/sound/' + data.status + '.mp3');
                    audio.play();
                    if (typeact == "add") {
                        if(data.status === 'success') {
                            bootbox.alert('<span class="text-success">' + data.msg + '</span>');
                            $("#modal_jns_perawatan_radiologi").modal('hide');
                        } else {
                            bootbox.alert('<span class="text-danger">' + data.msg + '</span>');
                        }    
                    }
                    else if (typeact == "edit") {
                        if(data.status === 'success') {
                            bootbox.alert('<span class="text-success">' + data.msg + '</span>');
                            $("#modal_jns_perawatan_radiologi").modal('hide');
                        } else {
                            bootbox.alert('<span class="text-danger">' + data.msg + '</span>');
                        }    
                    }
                    var_tbl_jns_perawatan_radiologi.draw();
                }
            })
        }
    });

    // ==============================================================
    // KETIKA TOMBOL SEARCH DITEKAN
    // ==============================================================
    $('#filter_search_jns_perawatan_radiologi').click(function () {
        var_tbl_jns_perawatan_radiologi.draw();
    });

    // ===========================================
    // KETIKA TOMBOL EDIT DITEKAN
    // ===========================================

    $("#edit_data_jns_perawatan_radiologi").click(function () {
        var rowData = var_tbl_jns_perawatan_radiologi.rows({ selected: true }).data()[0];
        if (rowData != null) {

            var kd_jenis_prw = rowData['kd_jenis_prw'];
            var nm_perawatan = rowData['nm_perawatan'];
            var bagian_rs = rowData['bagian_rs'];
            var bhp = rowData['bhp'];
            var tarif_perujuk = rowData['tarif_perujuk'];
            var tarif_tindakan_dokter = rowData['tarif_tindakan_dokter'];
            var tarif_tindakan_petugas = rowData['tarif_tindakan_petugas'];
            var kso = rowData['kso'];
            var menejemen = rowData['menejemen'];
            var total_byr = rowData['total_byr'];
            var kd_pj = rowData['kd_pj'];
            var status = rowData['status'];
            var kelas = rowData['kelas'];

            $("#typeact").val("edit");
  
            $('#kd_jenis_prw').val(kd_jenis_prw);
            $('#nm_perawatan').val(nm_perawatan);
            $('#bagian_rs').val(bagian_rs);
            $('#bhp').val(bhp);
            $('#tarif_perujuk').val(tarif_perujuk);
            $('#tarif_tindakan_dokter').val(tarif_tindakan_dokter);
            $('#tarif_tindakan_petugas').val(tarif_tindakan_petugas);
            $('#kso').val(kso);
            $('#menejemen').val(menejemen);
            $('#total_byr').val(total_byr);
            $('#kd_pj').val(kd_pj).change();
            $('#status').val(status).change();
            $('#kelas').val(kelas).change();

            $("#kd_jenis_prw").prop('readonly', true); // GA BISA DIEDIT KALI READONLY
            $('#modal-title').text("Edit Data Jns Perawatan Radiologi");
            $("#modal_jns_perawatan_radiologi").modal('show');
        }
        else {
            bootbox.alert("Silakan pilih data yang akan di edit.");
        }

    });

    // ==============================================================
    // TOMBOL  DELETE DI CLICK
    // ==============================================================
    jQuery("#hapus_data_jns_perawatan_radiologi").click(function () {
        var rowData = var_tbl_jns_perawatan_radiologi.rows({ selected: true }).data()[0];


        if (rowData) {
            var kd_jenis_prw = rowData['kd_jenis_prw'];
            bootbox.confirm('Anda yakin akan menghapus data dengan kd_jenis_prw="' + kd_jenis_prw, function(result) {
                if(result) {
                    $.ajax({
                        url: "{?=url(['jns_perawatan_radiologi','aksi'])?}",
                        method: "POST",
                        data: {
                            kd_jenis_prw: kd_jenis_prw,
                            typeact: 'del'
                        },
                        success: function (data) {
                            data = JSON.parse(data);
                            var audio = new Audio('{?=url()?}/assets/sound/' + data.status + '.mp3');
                            audio.play();
                            if(data.status === 'success') {
                                bootbox.alert('<span class="text-success">' + data.msg + '</span>');
                            } else {
                                bootbox.alert('<span class="text-danger">' + data.msg + '</span>');
                            }    
                            var_tbl_jns_perawatan_radiologi.draw();
                        }
                    })    
                }
            });

        }
        else {
            bootbox.alert("Pilih satu baris untuk dihapus");
        }
    });

    // ==============================================================
    // TOMBOL TAMBAH DATA DI CLICK
    // ==============================================================
    jQuery("#tambah_data_jns_perawatan_radiologi").click(function () {

        $('#kd_jenis_prw').val('{?=$this->core->setKodeJnsPerawatanRadiologi()?}');
        $('#nm_perawatan').val('');
        $('#bagian_rs').val('0');
        $('#bhp').val('0');
        $('#tarif_perujuk').val('0');
        $('#tarif_tindakan_dokter').val('0');
        $('#tarif_tindakan_petugas').val('0');
        $('#kso').val('0');
        $('#menejemen').val('0');
        $('#total_byr').val('0');
        $('#kd_pj').val('').change();
        $('#status').val('').change();
        $('#kelas').val('').change();

        $("#typeact").val("add");
        $("#kd_jenis_prw").prop('readonly', false);
        
        $('#modal-title').text("Tambah Data Jns Perawatan Radiologi");
        $("#modal_jns_perawatan_radiologi").modal('show');
    });

    // ===========================================
    // Ketika tombol lihat data di tekan
    // ===========================================
    $("#lihat_data_jns_perawatan_radiologi").click(function () {

        var search_field_jns_perawatan_radiologi = $('#search_field_jns_perawatan_radiologi').val();
        var search_text_jns_perawatan_radiologi = $('#search_text_jns_perawatan_radiologi').val();

        $.ajax({
            url: "{?=url(['jns_perawatan_radiologi','aksi'])?}",
            method: "POST",
            data: {
                typeact: 'lihat', 
                search_field_jns_perawatan_radiologi: search_field_jns_perawatan_radiologi, 
                search_text_jns_perawatan_radiologi: search_text_jns_perawatan_radiologi
            },
            dataType: 'json',
            success: function (res) {
                var eTable = "<div class='table-responsive'><table id='tbl_lihat_jns_perawatan_radiologi' class='table display dataTable' style='width:100%'><thead><th>Kd Jenis Prw</th><th>Nm Perawatan</th><th>Bagian Rs</th><th>Bhp</th><th>Tarif Perujuk</th><th>Tarif Tindakan Dokter</th><th>Tarif Tindakan Petugas</th><th>Kso</th><th>Menejemen</th><th>Total Byr</th><th>Kd Pj</th><th>Status</th><th>Kelas</th></thead>";
                for (var i = 0; i < res.length; i++) {
                    eTable += "<tr>";
                    eTable += '<td>' + res[i]['kd_jenis_prw'] + '</td>';
                    eTable += '<td>' + res[i]['nm_perawatan'] + '</td>';
                    eTable += '<td>' + res[i]['bagian_rs'] + '</td>';
                    eTable += '<td>' + res[i]['bhp'] + '</td>';
                    eTable += '<td>' + res[i]['tarif_perujuk'] + '</td>';
                    eTable += '<td>' + res[i]['tarif_tindakan_dokter'] + '</td>';
                    eTable += '<td>' + res[i]['tarif_tindakan_petugas'] + '</td>';
                    eTable += '<td>' + res[i]['kso'] + '</td>';
                    eTable += '<td>' + res[i]['menejemen'] + '</td>';
                    eTable += '<td>' + res[i]['total_byr'] + '</td>';
                    eTable += '<td>' + res[i]['kd_pj'] + '</td>';
                    eTable += '<td>' + res[i]['status'] + '</td>';
                    eTable += '<td>' + res[i]['kelas'] + '</td>';
                    eTable += "</tr>";
                }
                eTable += "</tbody></table></div>";
                $('#forTable_jns_perawatan_radiologi').html(eTable);
            }
        });

        $('#modal-title').text("Lihat Data");
        $("#modal_lihat_jns_perawatan_radiologi").modal('show');
    });
        
    // ===========================================
    // Ketika tombol export pdf di tekan
    // ===========================================
    $("#export_pdf").click(function () {

        var doc = new jsPDF('p', 'pt', 'A4'); /* pilih 'l' atau 'p' */
        var img = "{?=base64_encode(file_get_contents(url($settings['logo'])))?}";
        doc.addImage(img, 'JPEG', 20, 10, 50, 50);
        doc.setFontSize(20);
        doc.text("{$settings.nama_instansi}", 80, 35, null, null, null);
        doc.setFontSize(10);
        doc.text("{$settings.alamat} - {$settings.kota} - {$settings.propinsi}", 80, 46, null, null, null);
        doc.text("Telepon: {$settings.nomor_telepon} - Email: {$settings.email}", 80, 56, null, null, null);
        doc.line(20,70,572,70,null); /* doc.line(20,70,820,70,null); --> Jika landscape */
        doc.line(20,72,572,72,null); /* doc.line(20,72,820,72,null); --> Jika landscape */
        doc.setFontSize(14);
        doc.text("Tabel Data Jns Perawatan Radiologi", 20, 95, null, null, null);
        const totalPagesExp = "{total_pages_count_string}";        
        doc.autoTable({
            html: '#tbl_lihat_jns_perawatan_radiologi',
            startY: 105,
            margin: {
                left: 20, 
                right: 20
            }, 
            styles: {
                fontSize: 10,
                cellPadding: 5
            }, 
            didDrawPage: data => {
                let footerStr = "Page " + doc.internal.getNumberOfPages();
                if (typeof doc.putTotalPages === 'function') {
                footerStr = footerStr + " of " + totalPagesExp;
                }
                doc.setFontSize(10);
                doc.text(`© ${new Date().getFullYear()} {$settings.nama_instansi}.`, data.settings.margin.left, doc.internal.pageSize.height - 10);                
                doc.text(footerStr, data.settings.margin.left + 480, doc.internal.pageSize.height - 10);
           }
        });
        if (typeof doc.putTotalPages === 'function') {
            doc.putTotalPages(totalPagesExp);
        }
        // doc.save('table_data_jns_perawatan_radiologi.pdf');
        window.open(doc.output('bloburl'), '_blank',"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes");  
              
    })

    // ===========================================
    // Ketika tombol export xlsx di tekan
    // ===========================================
    $("#export_xlsx").click(function () {
        let tbl1 = document.getElementById("tbl_lihat_jns_perawatan_radiologi");
        let worksheet_tmp1 = XLSX.utils.table_to_sheet(tbl1);
        let a = XLSX.utils.sheet_to_json(worksheet_tmp1, { header: 1 });
        let worksheet1 = XLSX.utils.json_to_sheet(a, { skipHeader: true });
        const new_workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(new_workbook, worksheet1, "Data jns_perawatan_radiologi");
        XLSX.writeFile(new_workbook, 'tmp_file.xls');
    })

    $("#view_chart").click(function () {
        window.open(mlite.url + '/jns_perawatan_radiologi/chart?t=' + mlite.token, '_blank',"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes");  
    })   

    $('#total_byr').on('keyup', function() {
        var bagian_rs = parseInt($('#bagian_rs').val());
        var bhp = parseInt($('#bhp').val());
        var kso = parseInt($('#kso').val());
        var menejemen = parseInt($('#menejemen').val());
        var tarif_perujuk = parseInt($('#tarif_perujuk').val());
        var tarif_tindakan_dokter = parseInt($('#tarif_tindakan_dokter').val());
        var tarif_tindakan_petugas = parseInt($('#tarif_tindakan_petugas').val());
        var total_byr = (((((bagian_rs + bhp) + kso) + menejemen) + tarif_perujuk) + tarif_tindakan_dokter) + tarif_tindakan_petugas;
        $('#total_byr').val(total_byr);
    })

});