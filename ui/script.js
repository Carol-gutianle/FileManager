/**
 * baseUrl: server路径
 * rt: 整个文件树的根路径
 * repath: 筛选节点的正则表达式
 */
const baseUrl = 'http://127.0.0.1:5000'
let rt = '';
let repath = '';
let level = '';

function handleRoot(event) {
    rt = event.target.value;
}

function handleRepath(event) {
    repath = event.target.value;
}

function handleLevel(event) {
  level = event.target.value;
}

window.addEventListener('DOMContentLoaded', function() {
    const rootPath = document.querySelector("#root");
    const regPath = document.querySelector('#repath');
    const levelVal = document.querySelector('#level');
    rootPath.addEventListener("input", handleRoot);
    regPath.addEventListener("input", handleRepath);
    levelVal.addEventListener("input", handleLevel);
})

/**
 * 渲染：根据根节点，渲染一棵新的文件树
 * 示例：hdd:s3://opennlplab_hdd/llm_it/0420/sft_7132k_moss_remove_metains/
 */
function generateTree() {
    showLoading();
    const url = baseUrl + '/getTree';
    const xhr = new XMLHttpRequest();
    const params = new URLSearchParams();
    params.append('path', rt);
    xhr.open('POST', url);
    xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded'
    );
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            hideLoading();
            console.log(xhr.responseText);
            location.reload();
        }
    }
    xhr.send(params);
}

/**
 * 过滤：根据正则表达式，选择符合正则表达式的节点
 * 示例: /#/^sft/^1/^optimizer
 */
function filterNodes() {
    $('#jstree').jstree(true).deselect_all();
    var searchArray = repath.split('/').slice(1);
    var rootNode = $('#jstree').jstree(true).get_node('#');
    function searchNode(node, level) {
        var nodeInfo = $('#jstree').jstree(true).get_node(node.id);
        if (level === 0 || (level < searchArray.length && new RegExp(searchArray[level]).test(nodeInfo.text))) {
          if (level === searchArray.length - 1) {
            $('#jstree').jstree('select_node', node.id);
          } else {
            var children = Array.isArray(node.children) ? node.children : [node.children];
            console.log(level, children)
            for (var i = 0; i < children.length; i++) {
              searchNode($('#jstree').jstree(true).get_node(children[i]), level + 1);
            }
          }
        } else {
          $('#jstree').jstree('deselect_node', node.id);
        }
    }
    searchNode(rootNode, 0);
}

/**
 * 删除：获取选中节点，并拼成路径发送到后台
 */
function listSelectedNodes() {
    const selectedNodes = $('#jstree').jstree(true).get_selected();
    const roots = $('#jstree').jstree(true).get_json('#', { flat: false });
    return findPaths(roots, selectedNodes);    
  }
function findPaths(roots, selectedNodes, path = []) {
    let result = [];
    // 判断节点是否被选中或半选中
    const allChecked = roots.every(root => $('#jstree').jstree(true).is_checked(root.id));
    const someChecked = roots.some(root => $('#jstree').jstree(true).is_undetermined(root.id) || $('#jstree').jstree(true).is_checked(root.id));

    // 如果节点都被选中，则将它的路径添加到结果数组中
    if (allChecked) {
        result.push(path.join('/'));
    }

    // 如果有节点被半选中，则递归遍历子节点
    if (someChecked && !allChecked) {
        for (let root of roots) {
        for (let child of root.children) {
            const newPath = [...path, child.text];
            const childPaths = findPaths([child], selectedNodes, newPath);
            result = result.concat(childPaths);
        }
        }
    }
    return result;
}

/**
 * 弹窗
 */
function deleteConfirmation() {
    const items = listSelectedNodes();
    let message = '<p>您是否要删除以下文件：</p>';
    for (let i = 0; i < items.length; i++) {
      message += `<li>${i + 1}. ${items[i]}\n</li>`;
    }
  
    const dialog = document.createElement('div');
    dialog.innerHTML = message;
    dialog.classList.add('confirmation-dialog');
  
    const confirmButton = document.createElement('button');
    confirmButton.innerText = '确认删除';
    confirmButton.classList.add('confirm');
  
    const cancelButton = document.createElement('button');
    cancelButton.innerText = '取消删除';
    cancelButton.classList.add('cancel');
  
    confirmButton.addEventListener('click', () => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', baseUrl + '/delete');
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const response = Json.parse(xhr.responseText);
            console.log(response);
        }
      };
      xhr.send(JSON.stringify({items: items}));
      alert('删除成功！');
      document.body.removeChild(dialog);
    });
  
    cancelButton.addEventListener('click', () => {
      // 用户点击了“取消删除”，不执行任何操作
      alert('取消删除！');
      document.body.removeChild(dialog);
    });
  
    dialog.appendChild(confirmButton);
    dialog.appendChild(cancelButton);
    document.body.appendChild(dialog);
}

/**
 * 规则：控制隐式规则
 */
function digitMatch() {
  const rootNode = $('#jstree').jstree(true).get_node('#');
  function matchNode(node, curr, target) {
    const nodeInfo = $('#jstree').jstree(true).get_node(node.id);
    if (curr === target) {
      const num = parseInt(node.text);
      if ((num + 1) % 3000 === 0) {
        $('#jstree').jstree('deselect_node', node.id);
      }
    } else if (curr < target) {
      const children = node.children;
      for (let i = 0; i < children.length; i++) {
        const childNode = $('#jstree').jstree(true).get_node(children[i]);
        matchNode(childNode, curr + 1, target);
      }
    } else {
      return;
    }
  }
  matchNode(rootNode, 0, parseInt(level));
}
function showLoading() {
  $('#loading').show();
}
function hideLoading() {
  $('#loading').hide();
}