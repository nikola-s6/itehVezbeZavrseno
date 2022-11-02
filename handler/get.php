<?php

require "../dbBroker.php";
require "../model/tim.php";

if (isset($_POST['timID'])) {
    $status = Tim::getById($_POST['timID'], $conn);
    if ($status) {
        echo json_encode($status);
    } else {
        echo "Failed";
    }
}
