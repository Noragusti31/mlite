jQuery().ready(function () {
    var var_tbl_perusahaan_pasien = $('#tbl_perusahaan_pasien').DataTable({
        'processing': true,
        'serverSide': true,
        'serverMethod': 'post',
        'dom': 'Bfrtip',
        'searching': false,
        'select': true,
        'colReorder': true,
        "bInfo" : false,
        "ajax": {
            "url": "{?=url(['perusahaan_pasien','data'])?}",
            "dataType": "json",
            "type": "POST",
            "data": function (data) {

                // Read values
                var search_field_perusahaan_pasien = $('#search_field_perusahaan_pasien').val();
                var search_text_perusahaan_pasien = $('#search_text_perusahaan_pasien').val();
                
                data.search_field_perusahaan_pasien = search_field_perusahaan_pasien;
                data.search_text_perusahaan_pasien = search_text_perusahaan_pasien;
                
            }
        },
        "columns": [
            { 'data': 'kode_perusahaan' },
            { 'data': 'nama_perusahaan' },
            { 'data': 'alamat' },
            { 'data': 'kota' },
            { 'data': 'no_telp' }
        ],
        "columnDefs": [
            { 'targets': 0},
            { 'targets': 1},
            { 'targets': 2},
            { 'targets': 3},
            { 'targets': 4}
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
        selector: '#tbl_perusahaan_pasien tr', 
        trigger: 'right',
        callback: function(key, options) {
          var rowData = var_tbl_perusahaan_pasien.rows({ selected: true }).data()[0];
          if (rowData != null) {
            var kode_perusahaan = rowData['kode_perusahaan'];
            switch (key) {
                case 'detail' :
                    OpenModal(mlite.url + '/perusahaan_pasien/detail/' + kode_perusahaan + '?t=' + mlite.token);
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

    $("form[name='form_perusahaan_pasien']").validate({
        rules: {
            kode_perusahaan: 'required',
            nama_perusahaan: 'required',
            alamat: 'required',
            kota: 'required',
            no_telp: 'required'
        },
        messages: {
            kode_perusahaan:'Kode Perusahaan tidak boleh kosong!',
            nama_perusahaan:'Nama Perusahaan tidak boleh kosong!',
            alamat:'Alamat tidak boleh kosong!',
            kota:'Kota tidak boleh kosong!',
            no_telp:'No Telp tidak boleh kosong!'
        },
        submitHandler: function (form) {
            var kode_perusahaan= $('#kode_perusahaan').val();
            var nama_perusahaan= $('#nama_perusahaan').val();
            var alamat= $('#alamat').val();
            var kota= $('#kota').val();
            var no_telp= $('#no_telp').val();

            var typeact = $('#typeact').val();

            var formData = new FormData(form); // tambahan
            formData.append('typeact', typeact); // tambahan

            $.ajax({
                url: "{?=url(['perusahaan_pasien','aksi'])?}",
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
                            $("#modal_perusahaan_pasien").modal('hide');
                        } else {
                            bootbox.alert('<span class="text-danger">' + data.msg + '</span>');
                        }    
                    }
                    else if (typeact == "edit") {
                        if(data.status === 'success') {
                            bootbox.alert('<span class="text-success">' + data.msg + '</span>');
                            $("#modal_perusahaan_pasien").modal('hide');
                        } else {
                            bootbox.alert('<span class="text-danger">' + data.msg + '</span>');
                        }    
                    }
                    var_tbl_perusahaan_pasien.draw();
                }
            })
        }
    });

    // ==============================================================
    // KETIKA TOMBOL SEARCH DITEKAN
    // ==============================================================
    $('#filter_search_perusahaan_pasien').click(function () {
        var_tbl_perusahaan_pasien.draw();
    });

    // ===========================================
    // KETIKA TOMBOL EDIT DITEKAN
    // ===========================================

    $("#edit_data_perusahaan_pasien").click(function () {
        var rowData = var_tbl_perusahaan_pasien.rows({ selected: true }).data()[0];
        if (rowData != null) {

            var kode_perusahaan = rowData['kode_perusahaan'];
            var nama_perusahaan = rowData['nama_perusahaan'];
            var alamat = rowData['alamat'];
            var kota = rowData['kota'];
            var no_telp = rowData['no_telp'];

            $("#typeact").val("edit");
  
            $('#kode_perusahaan').val(kode_perusahaan);
            $('#nama_perusahaan').val(nama_perusahaan);
            $('#alamat').val(alamat);
            $('#kota').val(kota);
            $('#no_telp').val(no_telp);

            $("#kode_perusahaan").prop('readonly', true); // GA BISA DIEDIT KALI READONLY
            $('#modal-title').text("Edit Data Perusahaan Pasien");
            $("#modal_perusahaan_pasien").modal('show');
        }
        else {
            bootbox.alert("Silakan pilih data yang akan di edit.");
        }

    });

    // ==============================================================
    // TOMBOL  DELETE DI CLICK
    // ==============================================================
    jQuery("#hapus_data_perusahaan_pasien").click(function () {
        var rowData = var_tbl_perusahaan_pasien.rows({ selected: true }).data()[0];


        if (rowData) {
            var kode_perusahaan = rowData['kode_perusahaan'];
            bootbox.confirm('Anda yakin akan menghapus data dengan kode_perusahaan="' + kode_perusahaan, function(result) {
                if(result) {
                    $.ajax({
                        url: "{?=url(['perusahaan_pasien','aksi'])?}",
                        method: "POST",
                        data: {
                            kode_perusahaan: kode_perusahaan,
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
                            var_tbl_perusahaan_pasien.draw();
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
    jQuery("#tambah_data_perusahaan_pasien").click(function () {

        $('#kode_perusahaan').val('');
        $('#nama_perusahaan').val('');
        $('#alamat').val('');
        $('#kota').val('');
        $('#no_telp').val('');

        $("#typeact").val("add");
        $("#kode_perusahaan").prop('readonly', false);
        
        $('#modal-title').text("Tambah Data Perusahaan Pasien");
        $("#modal_perusahaan_pasien").modal('show');
    });

    // ===========================================
    // Ketika tombol lihat data di tekan
    // ===========================================
    $("#lihat_data_perusahaan_pasien").click(function () {

        var search_field_perusahaan_pasien = $('#search_field_perusahaan_pasien').val();
        var search_text_perusahaan_pasien = $('#search_text_perusahaan_pasien').val();

        $.ajax({
            url: "{?=url(['perusahaan_pasien','aksi'])?}",
            method: "POST",
            data: {
                typeact: 'lihat', 
                search_field_perusahaan_pasien: search_field_perusahaan_pasien, 
                search_text_perusahaan_pasien: search_text_perusahaan_pasien
            },
            dataType: 'json',
            success: function (res) {
                var eTable = "<div class='table-responsive'><table id='tbl_lihat_perusahaan_pasien' class='table display dataTable' style='width:100%'><thead><th>Kode Perusahaan</th><th>Nama Perusahaan</th><th>Alamat</th><th>Kota</th><th>No Telp</th></thead>";
                for (var i = 0; i < res.length; i++) {
                    eTable += "<tr>";
                    eTable += '<td>' + res[i]['kode_perusahaan'] + '</td>';
                    eTable += '<td>' + res[i]['nama_perusahaan'] + '</td>';
                    eTable += '<td>' + res[i]['alamat'] + '</td>';
                    eTable += '<td>' + res[i]['kota'] + '</td>';
                    eTable += '<td>' + res[i]['no_telp'] + '</td>';
                    eTable += "</tr>";
                }
                eTable += "</tbody></table></div>";
                $('#forTable_perusahaan_pasien').html(eTable);
            }
        });

        $('#modal-title').text("Lihat Data");
        $("#modal_lihat_perusahaan_pasien").modal('show');
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
        doc.text("Tabel Data Perusahaan Pasien", 20, 95, null, null, null);
        const totalPagesExp = "{total_pages_count_string}";        
        doc.autoTable({
            html: '#tbl_lihat_perusahaan_pasien',
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
        // doc.save('table_data_perusahaan_pasien.pdf');
        window.open(doc.output('bloburl'), '_blank',"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes");  
              
    })

    // ===========================================
    // Ketika tombol export xlsx di tekan
    // ===========================================
    $("#export_xlsx").click(function () {
        let tbl1 = document.getElementById("tbl_lihat_perusahaan_pasien");
        let worksheet_tmp1 = XLSX.utils.table_to_sheet(tbl1);
        let a = XLSX.utils.sheet_to_json(worksheet_tmp1, { header: 1 });
        let worksheet1 = XLSX.utils.json_to_sheet(a, { skipHeader: true });
        const new_workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(new_workbook, worksheet1, "Data perusahaan_pasien");
        XLSX.writeFile(new_workbook, 'tmp_file.xls');
    })

    $("#view_chart").click(function () {
        window.open(mlite.url + '/perusahaan_pasien/chart?t=' + mlite.token, '_blank',"toolbar=no,status=no,menubar=no,scrollbars=no,resizable=no,modal=yes");  
    })   

});