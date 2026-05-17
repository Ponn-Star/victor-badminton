import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AUTH_API = '/api/auth';
const PROD_API = '/api/products';
const ATH_API  = '/api/athletes';

const TYPE_LABELS = { racket: 'Vợt cầu lông', shoes: 'Giày', shuttle: 'Cầu lông' };

const EMPTY_PRODUCT = {
    name: '', series: '', type: 'racket', price: '', priceDisplay: '',
    description: '', img: '', features: '', weight: '', balance: '',
    flex: '', material: '', maxTension: '', color: '', size: '',
    sole: '', cushion: '', speed: '', feather: '', quantity: '', isActive: true,
};

const EMPTY_ATHLETE = {
    name: '', slug: '', country: '', events: '', careerHigh: '', img: '', img2: '', isActive: true,
};

// ── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, type, onClose }) {
    useEffect(() => {
        const t = setTimeout(onClose, 3000);
        return () => clearTimeout(t);
    }, [onClose]);
    if (!msg) return null;
    return (
        <div className={`admin-toast ${type}`}>
            <span>{msg}</span>
            <button onClick={onClose}>✕</button>
        </div>
    );
}

// ── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
    return (
        <div className="admin-overlay" onClick={onCancel}>
            <div className="admin-confirm" onClick={e => e.stopPropagation()}>
                <p>{message}</p>
                <div className="confirm-actions">
                    <button className="btn-danger" onClick={onConfirm}>Xác nhận</button>
                    <button className="btn-cancel" onClick={onCancel}>Huỷ</button>
                </div>
            </div>
        </div>
    );
}

// ── Product Form Modal ───────────────────────────────────────────────────────
function ProductModal({ form, onChange, onSubmit, onClose, editMode }) {
    return (
        <div className="admin-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên sản phẩm *</label>
                            <input name="name" value={form.name} onChange={onChange} placeholder="Vợt Victor Thruster K 9900" />
                        </div>
                        <div className="form-group">
                            <label>Loại sản phẩm *</label>
                            <select name="type" value={form.type} onChange={onChange}>
                                <option value="racket">Vợt cầu lông</option>
                                <option value="shoes">Giày</option>
                                <option value="shuttle">Cầu lông</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Series</label>
                            <input name="series" value={form.series} onChange={onChange} placeholder="Thruster K" />
                        </div>
                        <div className="form-group">
                            <label>Giá (số)</label>
                            <input name="price" type="number" value={form.price} onChange={onChange} placeholder="3500000" />
                        </div>
                        <div className="form-group">
                            <label>Giá hiển thị</label>
                            <input name="priceDisplay" value={form.priceDisplay} onChange={onChange} placeholder="3.500.000 đ" />
                        </div>
                        <div className="form-group">
                            <label>Hình ảnh (URL)</label>
                            <input name="img" value={form.img} onChange={onChange} placeholder="https://..." />
                        </div>
                        <div className="form-group form-full">
                            <label>Mô tả</label>
                            <textarea name="description" value={form.description} onChange={onChange} rows={3} placeholder="Mô tả sản phẩm..." />
                        </div>
                        {/* Racket fields */}
                        {form.type === 'racket' && <>
                            <div className="form-group"><label>Trọng lượng</label><input name="weight" value={form.weight} onChange={onChange} placeholder="88g" /></div>
                            <div className="form-group"><label>Điểm cân bằng</label><input name="balance" value={form.balance} onChange={onChange} placeholder="Head-Heavy" /></div>
                            <div className="form-group"><label>Độ uốn</label><input name="flex" value={form.flex} onChange={onChange} placeholder="Extra Stiff" /></div>
                            <div className="form-group"><label>Chất liệu</label><input name="material" value={form.material} onChange={onChange} placeholder="Nano Carbon" /></div>
                            <div className="form-group"><label>Độ căng tối đa</label><input name="maxTension" value={form.maxTension} onChange={onChange} placeholder="35 lbs" /></div>
                        </>}
                        {/* Shoes fields */}
                        {form.type === 'shoes' && <>
                            <div className="form-group"><label>Màu sắc</label><input name="color" value={form.color} onChange={onChange} placeholder="Trắng/Xanh" /></div>
                            <div className="form-group"><label>Size</label><input name="size" value={form.size} onChange={onChange} placeholder="36-45" /></div>
                            <div className="form-group"><label>Đế giày</label><input name="sole" value={form.sole} onChange={onChange} placeholder="Gum Rubber" /></div>
                            <div className="form-group"><label>Đệm</label><input name="cushion" value={form.cushion} onChange={onChange} placeholder="Energy Max" /></div>
                        </>}
                        {/* Shuttle fields */}
                        {form.type === 'shuttle' && <>
                            <div className="form-group"><label>Tốc độ</label><input name="speed" value={form.speed} onChange={onChange} placeholder="75-79" /></div>
                            <div className="form-group"><label>Lông vũ</label><input name="feather" value={form.feather} onChange={onChange} placeholder="Vịt tổng hợp" /></div>
                            <div className="form-group"><label>Số lượng/hộp</label><input name="quantity" value={form.quantity} onChange={onChange} placeholder="12" /></div>
                        </>}
                        <div className="form-group">
                            <label>Đặc tính (phân cách bởi dấu phẩy)</label>
                            <input name="features" value={form.features} onChange={onChange} placeholder="Công suất cao, Kiểm soát tốt" />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select name="isActive" value={form.isActive} onChange={e => onChange({ target: { name: 'isActive', value: e.target.value === 'true' } })}>
                                <option value="true">Hiển thị</option>
                                <option value="false">Ẩn</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-primary" onClick={onSubmit}>
                        {editMode ? 'Lưu thay đổi' : 'Thêm sản phẩm'}
                    </button>
                    <button className="btn-cancel" onClick={onClose}>Huỷ</button>
                </div>
            </div>
        </div>
    );
}

// ── Athlete Form Modal ───────────────────────────────────────────────────────
function AthleteModal({ form, onChange, onSubmit, onClose, editMode }) {
    return (
        <div className="admin-overlay" onClick={onClose}>
            <div className="admin-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{editMode ? 'Chỉnh sửa VĐV' : 'Thêm VĐV mới'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>
                <div className="modal-body">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tên VĐV *</label>
                            <input name="name" value={form.name} onChange={onChange} placeholder="Nguyễn Hải Đăng" />
                        </div>
                        <div className="form-group">
                            <label>Slug (URL) *</label>
                            <input name="slug" value={form.slug} onChange={onChange} placeholder="nguyen-hai-dang" />
                        </div>
                        <div className="form-group">
                            <label>Quốc gia</label>
                            <input name="country" value={form.country} onChange={onChange} placeholder="Việt Nam" />
                        </div>
                        <div className="form-group">
                            <label>Hạng cao nhất</label>
                            <input name="careerHigh" value={form.careerHigh} onChange={onChange} placeholder="#45 Thế giới" />
                        </div>
                        <div className="form-group form-full">
                            <label>Sự kiện (phân cách bởi dấu phẩy)</label>
                            <input name="events" value={form.events} onChange={onChange} placeholder="Men's Singles, Mixed Doubles" />
                        </div>
                        <div className="form-group">
                            <label>Ảnh 1 (URL)</label>
                            <input name="img" value={form.img} onChange={onChange} placeholder="https://..." />
                        </div>
                        <div className="form-group">
                            <label>Ảnh 2 (URL)</label>
                            <input name="img2" value={form.img2} onChange={onChange} placeholder="https://..." />
                        </div>
                        <div className="form-group">
                            <label>Trạng thái</label>
                            <select name="isActive" value={form.isActive} onChange={e => onChange({ target: { name: 'isActive', value: e.target.value === 'true' } })}>
                                <option value="true">Hiển thị</option>
                                <option value="false">Ẩn</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button className="btn-primary" onClick={onSubmit}>
                        {editMode ? 'Lưu thay đổi' : 'Thêm VĐV'}
                    </button>
                    <button className="btn-cancel" onClick={onClose}>Huỷ</button>
                </div>
            </div>
        </div>
    );
}

// ── Main AdminPage ───────────────────────────────────────────────────────────
function AdminPage() {
    const { user, isAdmin, loading, getToken } = useAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');

    // Toast & Confirm
    const [toast, setToast] = useState({ msg: '', type: 'success' });
    const [confirm, setConfirm] = useState(null);

    const showToast = useCallback((msg, type = 'success') => setToast({ msg, type }), []);

    // ── Users ──────────────────────────────────────────────────────────────
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);

    const fetchUsers = useCallback(async () => {
        setUsersLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${AUTH_API}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data.users);
            else showToast(data.message || 'Không thể tải danh sách user.', 'error');
        } catch {
            showToast('Không thể tải danh sách user.', 'error');
        } finally { setUsersLoading(false); }
    }, [getToken, showToast]);

    const updateRole = async (id, role) => {
        const token = await getToken();
        const res = await fetch(`${AUTH_API}/admin/users/${id}/role`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ role })
        });
        const data = await res.json();
        if (res.ok) {
            setUsers(users.map(u => u.id === id ? { ...u, role } : u));
            showToast(data.message);
        } else showToast(data.message, 'error');
    };

    const toggleStatus = async (id, isActive) => {
        const token = await getToken();
        const res = await fetch(`${AUTH_API}/admin/users/${id}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isActive: !isActive })
        });
        const data = await res.json();
        if (res.ok) {
            setUsers(users.map(u => u.id === id ? { ...u, isActive: !isActive } : u));
            showToast(data.message);
        } else showToast(data.message, 'error');
    };

    // ── Products ───────────────────────────────────────────────────────────
    const [products, setProducts] = useState([]);
    const [prodLoading, setProdLoading] = useState(false);
    const [prodFilter, setProdFilter] = useState('all');
    const [prodModal, setProdModal] = useState(false);
    const [prodForm, setProdForm] = useState(EMPTY_PRODUCT);
    const [prodEditId, setProdEditId] = useState(null);

    const fetchProducts = useCallback(async () => {
        setProdLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${PROD_API}/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setProducts(data.products || []);
            else showToast(data.message || `Lỗi tải sản phẩm (${res.status}).`, 'error');
        } catch {
            showToast('Không thể kết nối server.', 'error');
        } finally { setProdLoading(false); }
    }, [getToken, showToast]);

    const openAddProduct = () => { setProdForm(EMPTY_PRODUCT); setProdEditId(null); setProdModal(true); };
    const openEditProduct = (p) => {
        setProdForm({
            name: p.name || '', series: p.series || '', type: p.status || p.type || 'racket',
            price: p.price || '', priceDisplay: p.priceDisplay || '',
            description: p.description || '', img: p.img || '',
            features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || ''),
            weight: p.weight || '', balance: p.balance || '', flex: p.flex || '',
            material: p.material || '', maxTension: p.maxTension || '',
            color: p.color || '', size: p.size || '', sole: p.sole || '', cushion: p.cushion || '',
            speed: p.speed || '', feather: p.feather || '', quantity: p.quantity || '',
            isActive: p.isActive !== false,
        });
        setProdEditId(p._id);
        setProdModal(true);
    };

    const handleProdChange = (e) => {
        const { name, value } = e.target;
        setProdForm(f => ({ ...f, [name]: value }));
    };

    const submitProduct = async () => {
        if (!prodForm.name.trim()) { showToast('Vui lòng nhập tên sản phẩm.', 'error'); return; }
        const token = await getToken();
        const payload = {
            ...prodForm,
            price: prodForm.price ? Number(prodForm.price) : undefined,
            features: prodForm.features ? prodForm.features.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        const url = prodEditId ? `${PROD_API}/${prodEditId}` : PROD_API;
        const method = prodEditId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            showToast(prodEditId ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
            setProdModal(false);
            fetchProducts();
        } else showToast(data.message || 'Lỗi.', 'error');
    };

    const deleteProduct = (id) => {
        setConfirm({
            message: 'Bạn có chắc muốn xoá sản phẩm này không?',
            onConfirm: async () => {
                setConfirm(null);
                const token = await getToken();
                const res = await fetch(`${PROD_API}/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) { showToast('Đã xoá sản phẩm.'); fetchProducts(); }
                else showToast('Xoá thất bại.', 'error');
            }
        });
    };

    const restoreProduct = async (id) => {
        const token = await getToken();
        const res = await fetch(`${PROD_API}/${id}/restore`, {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) { showToast('Đã khôi phục sản phẩm.'); fetchProducts(); }
        else showToast('Khôi phục thất bại.', 'error');
    };

    const exportCSV = () => {
        const filtered = prodFilter === 'all' ? products : products.filter(p => p.type === prodFilter);
        const headers = ['Tên', 'Loại', 'Series', 'Giá', 'Trạng thái'];
        const rows = filtered.map(p => [
            `"${p.name || ''}"`,
            TYPE_LABELS[p.type] || p.type,
            `"${p.series || ''}"`,
            p.price || '',
            p.isActive ? 'Hiển thị' : 'Ẩn',
        ]);
        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'san-pham.csv'; a.click();
        URL.revokeObjectURL(url);
    };

    // ── Athletes ───────────────────────────────────────────────────────────
    const [athletes, setAthletes] = useState([]);
    const [athLoading, setAthLoading] = useState(false);
    const [athModal, setAthModal] = useState(false);
    const [athForm, setAthForm] = useState(EMPTY_ATHLETE);
    const [athEditId, setAthEditId] = useState(null);

    const fetchAthletes = useCallback(async () => {
        setAthLoading(true);
        try {
            const token = await getToken();
            const res = await fetch(`${ATH_API}/admin/all`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setAthletes(data.athletes || []);
            else showToast(data.message || `Lỗi tải VĐV (${res.status}).`, 'error');
        } catch {
            showToast('Không thể kết nối server.', 'error');
        } finally { setAthLoading(false); }
    }, [getToken, showToast]);

    const openAddAthlete = () => { setAthForm(EMPTY_ATHLETE); setAthEditId(null); setAthModal(true); };
    const openEditAthlete = (a) => {
        setAthForm({
            name: a.name || '', slug: a.slug || '', country: a.country || '',
            events: Array.isArray(a.events) ? a.events.join(', ') : (a.events || ''),
            careerHigh: a.careerHigh || '', img: a.img || '', img2: a.img2 || '',
            isActive: a.isActive !== false,
        });
        setAthEditId(a._id);
        setAthModal(true);
    };

    const handleAthChange = (e) => {
        const { name, value } = e.target;
        setAthForm(f => ({ ...f, [name]: value }));
    };

    const submitAthlete = async () => {
        if (!athForm.name.trim() || !athForm.slug.trim()) {
            showToast('Vui lòng nhập tên và slug.', 'error'); return;
        }
        const token = await getToken();
        const payload = {
            ...athForm,
            events: athForm.events ? athForm.events.split(',').map(s => s.trim()).filter(Boolean) : [],
        };
        const url = athEditId ? `${ATH_API}/${athEditId}` : ATH_API;
        const method = athEditId ? 'PUT' : 'POST';
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
            showToast(athEditId ? 'Cập nhật VĐV thành công!' : 'Thêm VĐV thành công!');
            setAthModal(false);
            fetchAthletes();
        } else showToast(data.message || 'Lỗi.', 'error');
    };

    const deleteAthlete = (id) => {
        setConfirm({
            message: 'Bạn có chắc muốn xoá VĐV này không?',
            onConfirm: async () => {
                setConfirm(null);
                const token = await getToken();
                const res = await fetch(`${ATH_API}/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) { showToast('Đã xoá VĐV.'); fetchAthletes(); }
                else showToast('Xoá thất bại.', 'error');
            }
        });
    };

    // ── AI Chat Monitor ───────────────────────────────────────────────────
    const [chatLogs, setChatLogs] = useState([]);
    const [chatStats, setChatStats] = useState(null);
    const [chatHealth, setChatHealth] = useState(null);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatPage, setChatPage] = useState(1);
    const [chatTotal, setChatTotal] = useState(0);
    const [chatPages, setChatPages] = useState(1);
    const [chatFilter, setChatFilter] = useState('all'); // all | blocked | error
    const [chatDetailLog, setChatDetailLog] = useState(null);

    const fetchChatData = useCallback(async (page = 1, filter = 'all') => {
        setChatLoading(true);
        try {
            const token = await getToken();
            const headers = { Authorization: `Bearer ${token}` };
            const params = new URLSearchParams({ page, limit: 20 });
            if (filter === 'blocked') params.set('blocked', 'true');
            if (filter === 'error')   params.set('hasError', 'true');

            const [logsRes, statsRes, healthRes] = await Promise.all([
                fetch(`/api/chat/admin/logs?${params}`, { headers }),
                fetch('/api/chat/admin/stats', { headers }),
                fetch('/api/chat/admin/health', { headers }),
            ]);
            const [logsData, statsData, healthData] = await Promise.all([
                logsRes.json(), statsRes.json(), healthRes.json(),
            ]);
            if (logsRes.ok) {
                setChatLogs(logsData.logs || []);
                setChatTotal(logsData.total || 0);
                setChatPages(logsData.pages || 1);
                setChatPage(logsData.page || 1);
            }
            if (statsRes.ok) setChatStats(statsData);
            if (healthRes.ok) setChatHealth(healthData);
        } catch {
            showToast('Không thể tải dữ liệu chat.', 'error');
        } finally { setChatLoading(false); }
    }, [getToken, showToast]);

    // ── Load data on tab change ───────────────────────────────────────────────────
    useEffect(() => {
        if (loading) return;               // Chờ Clerk init xong
        if (!isAdmin) { navigate('/'); return; }
        if (activeTab === 'users') fetchUsers();
        if (activeTab === 'products') fetchProducts();
        if (activeTab === 'athletes') fetchAthletes();
        if (activeTab === 'chat') fetchChatData(1, chatFilter);
    }, [activeTab, isAdmin, loading, fetchUsers, fetchProducts, fetchAthletes, fetchChatData, navigate]);

    if (loading) return (
        <div className="admin-loading" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh', fontSize:'18px', color:'#003DA5' }}>
            Đang tải...
        </div>
    );
    if (!isAdmin) return null;

    const filteredProducts = prodFilter === 'all' ? products : products.filter(p => p.status === prodFilter);

    const TAB_TITLES = { users: 'Quản lý người dùng', products: 'Quản lý sản phẩm', athletes: 'Quản lý vận động viên', chat: 'Giám sát Chat AI' };
    const NAV_ITEMS = [
        { key: 'users',    icon: '👥', label: 'Người dùng',    count: users.length },
        { key: 'products', icon: '🏸', label: 'Sản phẩm',      count: products.length },
        { key: 'athletes', icon: '🏅', label: 'Vận động viên', count: athletes.length },
        { key: 'chat',     icon: '🤖', label: 'Chat AI',         count: chatStats?.today ?? 0 },
    ];

    return (
        <div className="admin-layout">
            {/* ── Sidebar ─────────────────────────────────────── */}
            <aside className="admin-sidebar">
                <div className="sidebar-brand">
                    <span className="brand-logo">V</span>
                    <div>
                        <div className="brand-name">Victor</div>
                        <div className="brand-sub">Admin Panel</div>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {NAV_ITEMS.map(item => (
                        <button
                            key={item.key}
                            className={`sidebar-link ${activeTab === item.key ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.key)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {item.count > 0 && <span className="nav-badge">{item.count}</span>}
                        </button>
                    ))}
                    {/* Back button visible only in mobile horizontal nav */}
                    <button className="sidebar-link mobile-back-btn" onClick={() => navigate('/')} title="Về trang chủ">
                        <span className="nav-icon">⬅</span>
                        <span className="nav-label">Trang chủ</span>
                    </button>
                </nav>

                <div className="sidebar-footer">
                    {user?.avatar && <img src={user.avatar} alt="" className="sidebar-avatar" />}
                    <div className="sidebar-user-info">
                        <div className="sidebar-user-name">{user?.name || 'Admin'}</div>
                        <div className="sidebar-user-role">Administrator</div>
                    </div>
                    <button className="btn-back-home" onClick={() => navigate('/')} title="Về trang chủ">⬅</button>
                </div>
            </aside>

            {/* ── Main ────────────────────────────────────────── */}
            <div className="admin-main">
                {/* Toast */}
                <Toast msg={toast.msg} type={toast.type} onClose={() => setToast({ msg: '', type: 'success' })} />

                {/* Confirm Dialog */}
                {confirm && (
                    <ConfirmDialog
                        message={confirm.message}
                        onConfirm={confirm.onConfirm}
                        onCancel={() => setConfirm(null)}
                    />
                )}

                {/* Product Modal */}
                {prodModal && (
                    <ProductModal
                        form={prodForm}
                        onChange={handleProdChange}
                        onSubmit={submitProduct}
                        onClose={() => setProdModal(false)}
                        editMode={!!prodEditId}
                    />
                )}

                {/* Athlete Modal */}
                {athModal && (
                    <AthleteModal
                        form={athForm}
                        onChange={handleAthChange}
                        onSubmit={submitAthlete}
                        onClose={() => setAthModal(false)}
                        editMode={!!athEditId}
                    />
                )}

                <div className="admin-topbar">
                    <h1 className="topbar-title">{TAB_TITLES[activeTab]}</h1>
                    <div className="topbar-date">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                </div>

                <div className="admin-content">
            {/* ── Users Tab ────────────────────────────────────────────────── */}
            {activeTab === 'users' && (
                <div className="tab-content">
                    {usersLoading ? (
                        <div className="admin-loading">Đang tải...</div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Tên</th><th>Email</th><th>Phương thức</th>
                                        <th>Role</th><th>Trạng thái</th><th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} className={!u.isActive ? 'inactive' : ''}>
                                            <td>
                                                {u.avatar && <img src={u.avatar} alt="" className="user-avatar-sm" />}
                                                {u.name}
                                            </td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge-method ${u.provider === 'google' ? 'google' : 'email'}`}>
                                                    {u.provider === 'google' ? 'Google' : 'Email'}
                                                </span>
                                            </td>
                                            <td>
                                                <select value={u.role}
                                                    onChange={(e) => updateRole(u.id, e.target.value)}
                                                    disabled={u.id === user?.id}
                                                    className="role-select">
                                                    <option value="user">User</option>
                                                    <option value="admin">Admin</option>
                                                </select>
                                            </td>
                                            <td>
                                                <span className={`badge-status ${u.isActive ? 'active' : 'blocked'}`}>
                                                    {u.isActive ? 'Hoạt động' : 'Bị khoá'}
                                                </span>
                                            </td>
                                            <td>
                                                {u.id !== user?.id && (
                                                    <button
                                                        className={`btn-toggle ${u.isActive ? 'block' : 'unblock'}`}
                                                        onClick={() => toggleStatus(u.id, u.isActive)}>
                                                        {u.isActive ? 'Khoá' : 'Mở khoá'}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* ── Products Tab ─────────────────────────────────────────────── */}
            {activeTab === 'products' && (
                <div className="tab-content">
                    <div className="tab-toolbar">
                        <div className="filter-group">
                            {[['all', 'Tất cả'], ['racket', 'Vợt'], ['shoes', 'Giày'], ['shuttle', 'Cầu']].map(([v, l]) => (
                                <button key={v}
                                    className={`filter-btn ${prodFilter === v ? 'active' : ''}`}
                                    onClick={() => setProdFilter(v)}>
                                    {l}
                                </button>
                            ))}
                        </div>
                        <div className="toolbar-actions">
                            <button className="btn-export" onClick={exportCSV}>⬇ Xuất CSV</button>
                            <button className="btn-primary" onClick={openAddProduct}>+ Thêm sản phẩm</button>
                        </div>
                    </div>
                    {prodLoading ? (
                        <div className="admin-loading">Đang tải...</div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th><th>Tên sản phẩm</th><th>Loại</th>
                                        <th>Series</th><th>Giá</th><th>Trạng thái</th><th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredProducts.map((p, i) => (
                                        <tr key={p._id} className={!p.isActive ? 'inactive' : ''}>
                                            <td>{i + 1}</td>
                                            <td>
                                                {p.img && <img src={p.img} alt="" className="prod-img-sm" />}
                                                <span>{p.name}</span>
                                            </td>
                                            <td><span className={`badge-type type-${p.status}`}>{TYPE_LABELS[p.status] || p.status}</span></td>
                                            <td>{p.series || '—'}</td>
                                            <td>{p.priceDisplay || (p.price ? p.price.toLocaleString('vi-VN') + ' đ' : '—')}</td>
                                            <td>
                                                <span className={`badge-status ${p.isActive ? 'active' : 'blocked'}`}>
                                                    {p.isActive ? 'Hiển thị' : 'Đã ẩn'}
                                                </span>
                                            </td>
                                            <td className="action-cell">
                                                <button className="btn-edit" onClick={() => openEditProduct(p)}>Sửa</button>
                                                {p.isActive
                                                    ? <button className="btn-danger-sm" onClick={() => deleteProduct(p._id)}>Xoá</button>
                                                    : <button className="btn-restore" onClick={() => restoreProduct(p._id)}>Khôi phục</button>
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="table-count">Hiển thị {filteredProducts.length} sản phẩm</div>
                        </div>
                    )}
                </div>
            )}

            {/* ── Athletes Tab ─────────────────────────────────────────────── */}
            {activeTab === 'athletes' && (
                <div className="tab-content">
                    <div className="tab-toolbar">
                        <div className="filter-group" />
                        <button className="btn-primary" onClick={openAddAthlete}>+ Thêm VĐV</button>
                    </div>
                    {athLoading ? (
                        <div className="admin-loading">Đang tải...</div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th><th>Tên VĐV</th><th>Quốc gia</th>
                                        <th>Sự kiện</th><th>Hạng cao nhất</th><th>Trạng thái</th><th>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {athletes.map((a, i) => (
                                        <tr key={a._id} className={!a.isActive ? 'inactive' : ''}>
                                            <td>{i + 1}</td>
                                            <td>
                                                {a.img && <img src={a.img} alt="" className="prod-img-sm round" />}
                                                <span>{a.name}</span>
                                            </td>
                                            <td>{a.country || '—'}</td>
                                            <td>{Array.isArray(a.events) ? a.events.join(', ') : (a.events || '—')}</td>
                                            <td>{a.careerHigh || '—'}</td>
                                            <td>
                                                <span className={`badge-status ${a.isActive ? 'active' : 'blocked'}`}>
                                                    {a.isActive ? 'Hiển thị' : 'Đã ẩn'}
                                                </span>
                                            </td>
                                            <td className="action-cell">
                                                <button className="btn-edit" onClick={() => openEditAthlete(a)}>Sửa</button>
                                                <button className="btn-danger-sm" onClick={() => deleteAthlete(a._id)}>Xoá</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="table-count">Hiển thị {athletes.length} VĐV</div>
                        </div>
                    )}
                </div>
            )}

            {/* ── AI Chat Monitor Tab ───────────────────────────────────────────── */}
            {activeTab === 'chat' && (
                <div className="tab-content">
                    {/* Groq API Status */}
                    <div className="chat-monitor-header">
                        <div className="chat-health-card">
                            <div className="health-label">Trạng thái Groq API</div>
                            {chatHealth ? (
                                <div className={`health-status ${chatHealth.status}`}>
                                    <span className="health-dot" />
                                    {chatHealth.status === 'ok' && `Hoạt động tốt — ${chatHealth.latencyMs}ms`}
                                    {chatHealth.status === 'error' && 'Lỗi kết nối API'}
                                    {chatHealth.status === 'not_configured' && 'Chưa cấu hình GROQ_API_KEY'}
                                </div>
                            ) : (
                                <div className="health-status loading">Đang kiểm tra…</div>
                            )}
                            {chatHealth?.model && <div className="health-model">Model: {chatHealth.model}</div>}
                        </div>

                        {/* Stats cards */}
                        {chatStats && (
                            <div className="chat-stats-row">
                                <div className="chat-stat-card">
                                    <div className="stat-value">{chatStats.total}</div>
                                    <div className="stat-label">Tổng tin nhắn</div>
                                </div>
                                <div className="chat-stat-card today">
                                    <div className="stat-value">{chatStats.today}</div>
                                    <div className="stat-label">Hôm nay</div>
                                </div>
                                <div className="chat-stat-card blocked">
                                    <div className="stat-value">{chatStats.blocked}</div>
                                    <div className="stat-label">Bị chặn</div>
                                </div>
                                <div className="chat-stat-card error">
                                    <div className="stat-value">{chatStats.errors}</div>
                                    <div className="stat-label">Lỗi API</div>
                                </div>
                                {chatStats.avgResponseMs && (
                                    <div className="chat-stat-card">
                                        <div className="stat-value">{chatStats.avgResponseMs}ms</div>
                                        <div className="stat-label">TB phản hồi</div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Filter + Refresh */}
                    <div className="tab-toolbar">
                        <div className="filter-group">
                            {[['all', 'Tất cả'], ['blocked', 'Bị chặn'], ['error', 'Lỗi API']].map(([v, l]) => (
                                <button key={v}
                                    className={`filter-btn ${chatFilter === v ? 'active' : ''}`}
                                    onClick={() => { setChatFilter(v); fetchChatData(1, v); }}>
                                    {l}
                                </button>
                            ))}
                        </div>
                        <button className="btn-export" onClick={() => fetchChatData(chatPage, chatFilter)}>↺ Làm mới</button>
                    </div>

                    {chatLoading ? (
                        <div className="admin-loading">Đang tải…</div>
                    ) : (
                        <>
                            <div className="admin-table-wrap">
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Thời gian</th>
                                            <th>Tin nhắn người dùng</th>
                                            <th>Phản hồi AI</th>
                                            <th>TG phản hồi</th>
                                            <th>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chatLogs.length === 0 && (
                                            <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: '32px' }}>Chưa có dữ liệu</td></tr>
                                        )}
                                        {chatLogs.map((log, i) => (
                                            <tr key={log._id}
                                                className={`chat-log-row ${log.blocked ? 'blocked-row' : ''} ${log.hasError ? 'error-row' : ''}`}
                                                onClick={() => setChatDetailLog(log)}
                                                title="Nhấn để xem chi tiết">
                                                <td>{(chatPage - 1) * 20 + i + 1}</td>
                                                <td className="chat-time">{new Date(log.createdAt).toLocaleString('vi-VN')}</td>
                                                <td className="chat-msg-cell">{log.userMessage.length > 80 ? log.userMessage.slice(0, 80) + '…' : log.userMessage}</td>
                                                <td className="chat-msg-cell">
                                                    {log.blocked ? <span className="badge-blocked">Bị chặn</span>
                                                        : log.hasError ? <span className="badge-error">Lỗi API</span>
                                                        : (log.aiResponse?.slice(0, 80) || '—') + (log.aiResponse?.length > 80 ? '…' : '')}
                                                </td>
                                                <td>{log.responseTimeMs ? `${log.responseTimeMs}ms` : '—'}</td>
                                                <td>
                                                    {log.blocked && <span className="badge-status blocked">Chặn</span>}
                                                    {log.hasError && <span className="badge-status error-badge">Lỗi</span>}
                                                    {!log.blocked && !log.hasError && <span className="badge-status active">OK</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="table-count">
                                    Hiển thị {chatLogs.length} / {chatTotal} tin nhắn
                                </div>
                            </div>

                            {/* Pagination */}
                            {chatPages > 1 && (
                                <div className="chat-pagination">
                                    <button disabled={chatPage <= 1} onClick={() => fetchChatData(chatPage - 1, chatFilter)}>← Trước</button>
                                    <span>Trang {chatPage} / {chatPages}</span>
                                    <button disabled={chatPage >= chatPages} onClick={() => fetchChatData(chatPage + 1, chatFilter)}>Tiếp →</button>
                                </div>
                            )}
                        </>
                    )}

                    {/* Detail Modal */}
                    {chatDetailLog && (
                        <div className="admin-overlay" onClick={() => setChatDetailLog(null)}>
                            <div className="admin-modal chat-detail-modal" onClick={e => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h2>Chi tiết hội thoại</h2>
                                    <button className="modal-close" onClick={() => setChatDetailLog(null)}>✕</button>
                                </div>
                                <div className="modal-body">
                                    <div className="chat-detail-meta">
                                        <span>{new Date(chatDetailLog.createdAt).toLocaleString('vi-VN')}</span>
                                        {chatDetailLog.responseTimeMs && <span>Phản hồi: {chatDetailLog.responseTimeMs}ms</span>}
                                        {chatDetailLog.userId && <span>UserID: {chatDetailLog.userId}</span>}
                                    </div>
                                    <div className="chat-detail-bubble user-bubble">
                                        <strong>Người dùng:</strong>
                                        <p>{chatDetailLog.userMessage}</p>
                                    </div>
                                    <div className={`chat-detail-bubble ${chatDetailLog.blocked ? 'blocked-bubble' : chatDetailLog.hasError ? 'error-bubble' : 'ai-bubble'}`}>
                                        <strong>Victor Cortex:</strong>
                                        <p>
                                            {chatDetailLog.blocked ? '⛔ Tin nhắn bị chặn bởi content moderation'
                                                : chatDetailLog.hasError ? '⚠ Lỗi kết nối Groq API'
                                                : (chatDetailLog.aiResponse || '(Không có phản hồi)')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
                </div>
            </div>
        </div>
    );
}

export default AdminPage;
