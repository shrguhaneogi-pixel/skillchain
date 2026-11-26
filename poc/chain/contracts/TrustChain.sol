// SPDX-License-Identifier: MIT
pragma solidity ^0.8.39;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TrustChain is Ownable {
    enum Status { Unregistered, Verified, Suspended, Revoked }

    struct Record {
        bytes32 commitment;
        Status status;
        uint64 version;
        address verifier;
        uint64 timestamp;
    }

    error InvalidTransition();
    error EmptyCommitment();

    mapping(bytes32 companyId => Record) public records;

    event StatusChanged(
        bytes32 indexed companyId,
        Status status,
        bytes32 commitment,
        uint64 version,
        address verifier,
        uint64 timestamp
    );

    constructor(address verifier) Ownable(verifier) {}

    function register(bytes32 companyId, bytes32 commitment) external onlyOwner {
        if (records[companyId].status != Status.Unregistered) revert InvalidTransition();
        if (companyId == bytes32(0) || commitment == bytes32(0)) revert EmptyCommitment();
        records[companyId].commitment = commitment;
        _update(companyId, Status.Verified);
    }

    function changeStatus(bytes32 companyId, Status next) external onlyOwner {
        Status current = records[companyId].status;
        bool canChange = (current == Status.Verified && (next == Status.Suspended || next == Status.Revoked))
            || (current == Status.Suspended && (next == Status.Verified || next == Status.Revoked));
        if (!canChange) revert InvalidTransition();
        _update(companyId, next);
    }

    function _update(bytes32 companyId, Status status) private {
        Record storage record = records[companyId];
        record.status = status;
        record.version += 1;
        record.verifier = msg.sender;
        record.timestamp = uint64(block.timestamp);
        emit StatusChanged(companyId, status, record.commitment, record.version, record.verifier, record.timestamp);
    }
}
